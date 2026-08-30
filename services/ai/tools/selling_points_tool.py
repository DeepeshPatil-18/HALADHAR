"""
Nearby Selling Points Tool - Wrapper around existing Mappls integration
Reuses: backend/services/mappls_service.py
"""

from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Mistral Agent function schema
selling_points_tool = {
    "type": "function",
    "function": {
        "name": "get_selling_points",
        "description": "Find nearby selling points, markets, mandis, collection centres, and buyers for agricultural products. Uses Mappls location data to find places within specified radius.",
        "parameters": {
            "type": "object",
            "properties": {
                "product": {
                    "type": "string",
                    "description": "Product/commodity name. Examples: 'Onion', 'प्याज', 'Milk', 'दूध', 'Eggs', 'अंडे'"
                },
                "location": {
                    "type": "string",
                    "description": "Location name. Examples: 'Kopergaon', 'कोपरगांव', 'Nashik', 'नाशिक'. Defaults to 'Kopergaon'."
                },
                "radius": {
                    "type": "integer",
                    "description": "Search radius in meters. Range: 500-10000. Default: 5000 (5km)."
                }
            },
            "required": ["product"]
        }
    }
}

# Location coordinates mapping (same as weather_tool)
LOCATION_COORDS = {
    "kopergaon": (19.8826, 74.4764),
    "कोपरगांव": (19.8826, 74.4764),
    "ahmednagar": (19.0948, 74.7480),
    "अहमदनगर": (19.0948, 74.7480),
    "nashik": (19.9975, 73.7898),
    "नाशिक": (19.9975, 73.7898),
    "pune": (18.5204, 73.8567),
    "पुणे": (18.5204, 73.8567),
    "mumbai": (19.0760, 72.8777),
    "मुंबई": (19.0760, 72.8777)
}


async def get_selling_points(
    product: str,
    location: Optional[str] = None,
    radius: Optional[int] = None
) -> Dict[str, Any]:
    """
    Find nearby selling points using existing Mappls integration.
    
    This is a thin wrapper - all logic is in the existing Mappls service.
    
    Args:
        product: Product/commodity name
        location: Location name (defaults to Kopergaon)
        radius: Search radius in meters (defaults to 5000)
        
    Returns:
        Structured response with selling points and navigation action
    """
    # Defaults
    if not location:
        location = "Kopergaon"
    if not radius:
        radius = 5000
    
    # Validate radius
    radius = max(500, min(10000, radius))
    
    logger.info(f"[TOOL:get_selling_points] product={product}, location={location}, radius={radius}")
    
    try:
        # Normalize location name
        location_key = location.lower().strip()
        
        # Get coordinates
        if location_key in LOCATION_COORDS:
            lat, lon = LOCATION_COORDS[location_key]
            location_display = location
        else:
            # Default to Kopergaon
            lat, lon = LOCATION_COORDS["kopergaon"]
            location_display = "Kopergaon"
            logger.warning(f"[TOOL:get_selling_points] Unknown location '{location}', defaulting to Kopergaon")
        
        # Call existing Mappls integration (NO DUPLICATION)
        from services.mappls_service import get_mappls_service
        
        mappls = get_mappls_service()
        selling_points = await mappls.find_nearby_selling_points(
            product=product,
            latitude=lat,
            longitude=lon,
            radius=radius,
            max_results=10
        )
        
        # Check if any points found
        if not selling_points:
            logger.warning(f"[TOOL:get_selling_points] No selling points found for {product} near {location}")
            return {
                "status": "unavailable",
                "message": f"{location} के पास {product} के लिए कोई विक्रय स्थल नहीं मिला।",
                "product": product,
                "location": location_display,
                "total_count": 0,
                "selling_points": [],
                "navigation": {
                    "enabled": True,
                    "label": "नक्शे पर देखें",
                    "label_english": "View on map",
                    "route": "/market",
                    "params": {}
                }
            }
        
        # Format selling points summary (first 3)
        points_summary = []
        for point in selling_points[:3]:
            points_summary.append({
                "name": point.get("name", ""),
                "type": point.get("type", ""),
                "address": point.get("address", ""),
                "distance_km": point.get("distance_km"),
                "contact": point.get("contact")
            })
        
        response = {
            "status": "available",
            "product": product,
            "location": location_display,
            "radius_km": radius / 1000,
            "total_count": len(selling_points),
            "selling_points": points_summary,
            "showing": len(points_summary),
            "source": "Mappls",
            "navigation": {
                "enabled": True,
                "label": "नक्शे पर देखें",
                "label_english": "View on map",
                "route": "/market",
                "params": {
                    "product": product.lower()
                }
            }
        }
        
        logger.info(f"[TOOL:get_selling_points] Success: Found {len(selling_points)} selling points")
        return response
        
    except Exception as e:
        logger.error(f"[TOOL:get_selling_points] Error: {e}")
        return {
            "status": "error",
            "message": f"विक्रय स्थल खोजने में त्रुटि: {str(e)}",
            "product": product,
            "location": location or "Kopergaon",
            "navigation": None
        }
