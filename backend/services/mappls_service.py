"""
Mappls (MapmyIndia) Integration Service

Provides location-based services for finding nearby selling points
for agricultural products.

Mappls API Documentation: https://developer.mappls.com/
"""

import os
import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)


class MapplsService:
    """
    Service for interacting with Mappls Nearby API to find selling points.
    
    Mappls is India's leading mapping and location intelligence platform.
    Uses the Nearby Places API to discover agricultural markets and buyers.
    """
    
    def __init__(self):
        # Get API access token from environment
        # Static access token from Mappls Console
        self.access_token = os.getenv("MAPPLS_ACCESS_TOKEN", "")
        
        # Log token status (first 10 chars only for security)
        if self.access_token:
            logger.info(f"Mappls access token loaded: {self.access_token[:10]}...")
        else:
            logger.warning("Mappls access token not configured in environment")
        
        # Mappls Nearby Search API base URL
        self.nearby_url = "https://search.mappls.com/search/places/nearby/json"
    
    def _get_search_keywords_for_product(self, product: str) -> str:
        """
        Determine search keywords based on product type.
        Uses semicolon (;) as OR operator for Mappls API.
        
        Strategy: Use specific market types + product name for better matching
        
        Args:
            product: Product name (e.g., "Onion", "Milk", "Eggs", "Ladyfinger", "Ginger")
            
        Returns:
            Search keyword string for Mappls API, or empty if clearly non-agricultural
        """
        product_lower = product.lower()
        
        # List of clearly NON-agricultural terms that should return 0 results
        non_agricultural = ['book', 'laptop', 'phone', 'computer', 'mobile', 'car', 'bike', 
                           'furniture', 'clothes', 'dress', 'shirt', 'shoe', 'electronics',
                           'tv', 'television', 'fridge', 'ac', 'fan', 'toy', 'game']
        
        if any(word in product_lower for word in non_agricultural):
            logger.info(f"Product '{product}' is non-agricultural, returning empty")
            return ''
        
        # Dairy-related: Prioritize dairy centers, not general stores
        if any(word in product_lower for word in ['milk', 'dairy', 'buffalo', 'cow', 'dudh', 'दूध', 'ghee', 'paneer', 'curd', 'dahi', 'cheese', 'butter']):
            return f'dairy;milk collection centre;cooperative;{product}'
        
        # Poultry/Meat-related: Kirana stores DO sell these
        if any(word in product_lower for word in ['egg', 'poultry', 'chicken', 'broiler', 'hen', 'murgi', 'अंडे', 'मुर्गी', 'meat', 'mutton', 'goat', 'bakra']):
            return f'meat shop;poultry;grocery;kirana;{product}'
        
        # Fish/Seafood: Prioritize fish markets
        if any(word in product_lower for word in ['fish', 'fishery', 'aquaculture', 'machli', 'मछली', 'prawn', 'seafood', 'shrimp']):
            return f'fish market;seafood;fishery;{product}'
        
        # Fruit: Prioritize fruit markets, not general stores
        if any(word in product_lower for word in ['fruit', 'apple', 'banana', 'mango', 'orange', 'phal', 'फल', 'grape', 'pomegranate', 'guava', 'papaya', 'watermelon', 'strawberry']):
            return f'fruit market;fruit;mandi;APMC;{product}'
        
        # Grain/Cereal: Grain markets, not general stores
        if any(word in product_lower for word in ['wheat', 'rice', 'maize', 'bajra', 'jowar', 'grain', 'gehun', 'chawal', 'गेहूं', 'चावल', 'मक्का', 'dal', 'lentil', 'pulse', 'flour', 'atta']):
            return f'grain market;grain;mandi;APMC;FCI;{product}'
        
        # Commercial crops: Wholesale markets
        if any(word in product_lower for word in ['cotton', 'sugarcane', 'jute', 'kapas', 'ganna', 'कपास', 'ऊख', 'tobacco', 'rubber']):
            return f'cotton market;APMC;mandi;agricultural market;{product}'
        
        # Spices/Herbs: These ARE commonly sold at kirana stores
        if any(word in product_lower for word in ['spice', 'masala', 'turmeric', 'haldi', 'ginger', 'adrak', 'garlic', 'lahsun', 'chili', 'mirch', 'cumin', 'jeera', 'coriander', 'dhania']):
            return f'spice shop;grocery;kirana;market;{product}'
        
        # Default: Vegetables and other produce - Prioritize proper markets
        logger.info(f"Product '{product}' using vegetable/general agricultural search")
        return f'vegetable market;fruit market;mandi;APMC;agricultural market;{product}'
    
    async def find_nearby_selling_points(
        self,
        product: str,
        latitude: float,
        longitude: float,
        radius: int = 5000,  # 5km default
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find nearby selling points for a product using Mappls Nearby API.
        
        Args:
            product: Product name (e.g., "Onion", "Milk", "Eggs")
            latitude: Latitude of search location
            longitude: Longitude of search location
            radius: Search radius in meters (min: 500, max: 10000, default: 5000)
            max_results: Maximum number of results to return
            
        Returns:
            List of selling point dictionaries with name, type, address, distance, etc.
        """
        if not self.access_token:
            logger.warning("Mappls access token not configured")
            return []
        
        # Clamp radius to Mappls limits
        radius = max(500, min(10000, radius))
        
        try:
            # Get relevant search keywords for the product
            keywords = self._get_search_keywords_for_product(product)
            
            # If no keywords (non-agricultural product), return empty results
            if not keywords:
                logger.info(f"No keywords for product '{product}', returning empty results")
                return []
            
            async with httpx.AsyncClient() as client:
                # Build request parameters according to Mappls API spec
                params = {
                    "keywords": keywords,  # Using ; as OR operator
                    "refLocation": f"{latitude},{longitude}",
                    "radius": radius,
                    "sortBy": "dist:asc",  # Sort by distance ascending
                    "region": "IND",  # India
                    "page": 1,
                    "access_token": self.access_token
                }
                
                response = await client.get(
                    self.nearby_url,
                    params=params,
                    timeout=10.0
                )
                
                logger.info(f"Mappls API response status: {response.status_code}")
                
                if response.status_code != 200:
                    logger.error(f"Mappls API error: {response.status_code} - {response.text}")
                    return []
                
                data = response.json()
                logger.info(f"Mappls API returned: {len(data.get('suggestedLocations', []))} locations")
                
                # Parse Mappls response according to their spec
                results = []
                
                if "suggestedLocations" in data:
                    for location in data["suggestedLocations"][:max_results]:
                        # Format distance
                        distance_m = location.get("distance", 0)
                        if distance_m < 1000:
                            distance_str = f"{distance_m} m"
                        else:
                            distance_km = distance_m / 1000
                            distance_str = f"{distance_km:.1f} km"
                        
                        # Build contact info
                        contact_parts = []
                        if location.get("mobileNo"):
                            contact_parts.append(location["mobileNo"])
                        if location.get("landlineNo"):
                            contact_parts.append(location["landlineNo"])
                        contact = ", ".join(contact_parts) if contact_parts else None
                        
                        result = {
                            "name": location.get("placeName", "Unknown"),
                            "type": location.get("type", "POI"),
                            "address": location.get("placeAddress", ""),
                            "distance": distance_str,
                            "distance_meters": distance_m,
                            "contact": contact,
                            "email": location.get("email") if location.get("email") else None,
                            "place_id": location.get("eLoc"),  # Mappls unique ID
                            "keywords": location.get("keywords", []),
                            "source": "mappls"
                        }
                        results.append(result)
                
                logger.info(f"Found {len(results)} nearby selling points for {product}")
                return results
                
        except httpx.TimeoutException:
            logger.error("Mappls API request timed out")
            return []
        except Exception as e:
            logger.error(f"Error finding nearby selling points: {str(e)}")
            return []
    
    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a specific place (if needed in future).
        
        Args:
            place_id: Mappls eLoc (place ID)
            
        Returns:
            Place details dictionary or None
        """
        # This can be implemented later if detailed place info is needed
        # For now, nearby search provides sufficient information
        logger.info(f"Place details for {place_id} not yet implemented")
        return None


# Singleton instance
_mappls_service: Optional[MapplsService] = None


def get_mappls_service() -> MapplsService:
    """Get or create Mappls service instance."""
    global _mappls_service
    if _mappls_service is None:
        _mappls_service = MapplsService()
    return _mappls_service
