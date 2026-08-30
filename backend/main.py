"""
KrishiMitra FastAPI backend — entry point.

Run with:
    uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
from datetime import datetime
from typing import Optional
import httpx
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
import config  # This loads .env file via python-dotenv

# Import data providers
from services.data_provider import (
    EnterpriseProvider,
    SchemeProvider,
    TrainingProvider,
    MarketProvider
)
from services.advisory_service import AdvisoryService

# Import data sources  
from data_sources.weather_source import WeatherSource
from data_sources.mandi_source import MandiSource

# Import services
from services.allied_service import AlliedMarketService

# Import route modules
from routes.scheme_routes import router as scheme_router
from routes.ai_routes import router as ai_router
from routes.blackout_routes import router as blackout_router
from routes.farmer_context_routes import router as farmer_context_router

# Import schemas
from schemas import (
    AdvisoryRequest,
    AdvisoryResponse,
    ChatRequest,
    ChatResponse,
    SchemeSearchRequest,
    WeatherRequest
)

app = FastAPI(
    title="KrishiMitra API",
    description="Backend API for the KrishiMitra agricultural advisory platform.",
    version="0.1.0",
)

# Allow all origins during development; tighten in production.
import os
_allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
_origins = ["*"] if _allowed_origins == "*" else [o.strip() for o in _allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory path
DATA_DIR = Path(__file__).parent / "data"

# Initialize allied market service
allied_market_service = AlliedMarketService()

# Include routers
app.include_router(scheme_router)
app.include_router(ai_router)
app.include_router(blackout_router)
app.include_router(farmer_context_router)


@app.get("/health", tags=["System"])
async def health_check():
    """Liveness probe — returns 200 OK when the server is running."""
    return {"status": "ok"}


@app.post("/api/v1/schemes/search", tags=["Schemes"])
async def search_schemes(request: dict):
    """
    Search government schemes from the database.
    
    Request body:
    - query: str (optional) - Search term to filter schemes
    - state: str (optional) - Filter by state
    - enterprise: str (optional) - Filter by enterprise type
    """
    try:
        # Use SchemeProvider to get schemes
        if request.get("enterprise"):
            schemes = SchemeProvider.get_schemes_by_enterprise(
                request.get("enterprise"),
                request.get("state", "maharashtra")
            )
        else:
            schemes = SchemeProvider.get_all_schemes()
        
        # Apply additional filters
        query = request.get("query", "").lower().strip()
        state_filter = request.get("state", "").lower().strip()
        
        filtered_schemes = []
        for scheme in schemes:
            # Check if scheme is active
            if not scheme.get("is_active", True):
                continue
            
            # Apply text search filter
            if query:
                searchable_text = " ".join([
                    scheme.get("name", ""),
                    scheme.get("description", ""),
                    scheme.get("department", ""),
                    scheme.get("enterprise", ""),
                ]).lower()
                
                if query not in searchable_text:
                    continue
            
            # Apply state filter (if not already filtered)
            if state_filter and state_filter != "all" and not request.get("enterprise"):
                scheme_state = scheme.get("state", "").lower()
                if scheme_state not in [state_filter, "all_india"]:
                    continue
            
            filtered_schemes.append(scheme)
        
        # Format schemes for frontend (matching TypeScript types)
        formatted_schemes = []
        for i, s in enumerate(filtered_schemes):
            formatted_scheme = {
                "id": i,
                "name": s.get("name", ""),
                "description": s.get("description", ""),
                "ministry": s.get("department", ""),
                "state": s.get("state", ""),
                "enterprise_type": s.get("enterprise", ""),
                "eligibility": {
                    "conditions": s.get("eligibility_criteria", [])
                },
                "benefits": {
                    "subsidy_percentage": s.get("subsidy_percentage"),
                    "other_benefits": [
                        f"Subsidy Amount: ₹{s.get('subsidy_amount_rupees', 0):,}"
                    ] if s.get("subsidy_amount_rupees") else []
                },
                "application_process": {
                    "how_to_apply": s.get("application_process", ""),
                    "required_documents": s.get("required_documents", []),
                    "processing_time": f"{s.get('processing_time_days', 'N/A')} days" if s.get("processing_time_days") else "Not specified",
                    "deadline": s.get("application_deadline")
                },
                "contact_info": {
                    "website": s.get("official_source_url", "")
                }
            }
            formatted_schemes.append(formatted_scheme)
        
        return {
            "schemes": formatted_schemes,
            "total_count": len(formatted_schemes),
            "search_query": query or None,
            "filters": {
                "state": state_filter or None,
                "enterprise": request.get("enterprise") or None
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching schemes: {str(e)}")


@app.post("/api/v1/assistant/chat", tags=["Assistant"])
async def assistant_chat(request: dict):
    """
    AI assistant chat endpoint.
    
    Request body:
    - message: str - User's message
    - language: str (optional) - Language code (english, hindi, marathi, auto)
    - farmer_context: dict (optional) - Context about the farmer
    
    Note: This is a placeholder implementation. Full AI integration coming soon.
    """
    try:
        message = request.get("message", "")
        language = request.get("language", "english")
        farmer_context = request.get("farmer_context", {})
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Placeholder response with context awareness
        response_text = f"Thank you for your message: '{message}'. "
        
        # Add context-aware response
        if farmer_context:
            budget = farmer_context.get("budget")
            land = farmer_context.get("land")
            experience = farmer_context.get("experience")
            
            if budget or land or experience:
                response_text += "Based on your profile "
                details = []
                if budget:
                    details.append(f"(budget: ₹{budget:,})")
                if land:
                    details.append(f"(land: {land} acres)")
                if experience:
                    details.append(f"(experience: {experience})")
                response_text += " ".join(details) + ", "
        
        response_text += "I can help you with agricultural advisory, government schemes, market prices, and training resources. AI integration with full context understanding is coming soon!"
        
        # Simple intent detection based on keywords
        intent = "general"
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["scheme", "subsidy", "government", "yojana"]):
            intent = "scheme_search"
            response_text = "I can help you find government schemes. Try searching on the Schemes page for subsidies relevant to your enterprise type."
        elif any(word in message_lower for word in ["price", "market", "mandi", "sell"]):
            intent = "market_search"
            response_text = "I can help you find market prices. Check the Market Linkage page to search for current prices of agricultural commodities."
        elif any(word in message_lower for word in ["training", "learn", "course", "how to"]):
            intent = "training"
            response_text = "I can help you find training resources. Training modules for various enterprises are available in our database."
        elif any(word in message_lower for word in ["grow", "start", "business", "enterprise", "suggest"]):
            intent = "advisory"
            response_text = "I can help with enterprise recommendations. Based on your budget and land, I can suggest suitable agricultural enterprises."
        
        return {
            "response": response_text,
            "intent": intent,
            "response_type": "informational",
            "detected_language": language,
            "information_completeness": 0.5,
            "requires_further_input": False,
            "suggested_next_action": None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@app.get("/api/v1/market/prices", tags=["Market"])
async def get_market_prices(
    commodity: str,
    state: Optional[str] = None,
    district: Optional[str] = None
):
    """
    Get market prices for agricultural commodities.
    
    Query parameters:
    - commodity: str (required) - Name of the commodity
    - state: str (optional) - State name
    - district: str (optional) - District name
    
    Note: This is a placeholder implementation returning cached data.
    Real-time API integration coming soon.
    """
    try:
        # Load cached market prices
        cache_file = DATA_DIR / "market_prices_cache.json"
        
        if cache_file.exists():
            with open(cache_file, encoding="utf-8") as f:
                cache_data = json.load(f)
                cached_prices = cache_data.get("prices", [])
            
            # Try to find matching commodity in cache
            matching_prices = [
                p for p in cached_prices
                if commodity.lower() in p.get("commodity", "").lower()
            ]
            
            if matching_prices:
                # Apply state/district filters if provided
                if state:
                    matching_prices = [
                        p for p in matching_prices
                        if state.lower() in p.get("state", "").lower()
                    ]
                if district:
                    matching_prices = [
                        p for p in matching_prices
                        if district.lower() in p.get("district", "").lower()
                    ]
                
                if matching_prices:
                    return {
                        "prices": matching_prices,
                        "source": "CACHED",
                        "last_updated": cache_data.get("last_updated", datetime.now().isoformat())
                    }
        
        # Fallback: Generate sample data if not in cache
        sample_price = {
            "commodity": commodity,
            "state": state or "Maharashtra",
            "district": district or "Pune",
            "market": f"APMC {district or 'Pune'}",
            "price_per_quintal": 2500,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "source": "CACHED"
        }
        
        return {
            "prices": [sample_price],
            "source": "CACHED",
            "last_updated": datetime.now().isoformat(),
            "note": "This is sample data. Real-time market price integration coming soon."
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market prices: {str(e)}")


@app.get("/api/v1/weather", tags=["Weather"])
async def get_weather(
    lat: float,
    lon: float,
    location: str = "Kopergaon",
    state: str = "maharashtra",
    district: str = None
):
    """
    Get farmer-focused weather forecast with NDMA SACHET disaster alerts.
    
    Query parameters:
    - lat: float (required) - Latitude coordinate
    - lon: float (required) - Longitude coordinate
    - location: str (optional, default=Kopergaon) - Location name for display
    - state: str (optional, default=maharashtra) - State name for SACHET alerts
    - district: str (optional) - District name for filtering SACHET alerts
    
    Returns:
    - Comprehensive weather data focused on rainfall and farmer needs
    - Official NDMA SACHET disaster/weather alerts (when available)
    - Rain event detection with meaningful thresholds
    - Hourly and daily forecasts
    - Farmer advisory
    
    Features:
    - Automatic rain event detection (groups consecutive rainy hours)
    - NDMA SACHET CAP feed integration for official alerts
    - Response caching (30 minutes)
    - Mobile-friendly format
    - Graceful degradation if SACHET unavailable
    """
    try:
        from services.weather_service import WeatherService
        
        weather_data = await WeatherService.get_farmer_weather(
            latitude=lat,
            longitude=lon,
            location_name=location,
            state=state,
            district=district
        )
        return weather_data
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Weather API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching weather data: {str(e)}"
        )


@app.get("/api/v1/mandi-price", tags=["Market"])
async def get_mandi_price(
    commodity: str,
    state: Optional[str] = None,
    market: Optional[str] = None
):
    """
    Get live mandi prices from Farmer.in Open API.
    
    Query parameters:
    - commodity: str (required) - Commodity name (e.g., "Onion", "Wheat", "Rice")
    - state: str (optional) - State filter (Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka)
    - market: str (optional) - Market/District name filter
    
    Returns:
    - Live mandi prices with min, max, and modal prices per quintal
    - Data sourced from Agmarknet / Government of India via Farmer.in
    
    Supported states: Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka
    """
    try:
        mandi_data = await MandiSource.fetch_mandi_prices(
            commodity=commodity,
            state=state,
            market=market
        )
        return mandi_data
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Mandi API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Error fetching mandi prices: {str(e)}"
        )


@app.get("/api/v1/allied-price", tags=["Allied Market"])
async def get_allied_price(
    enterprise: str,
    commodity: str,
    state: Optional[str] = None,
    district: Optional[str] = None,
    market: Optional[str] = None
):
    """
    Get allied agricultural enterprise market prices.
    
    Separate from crop mandi prices - uses specialized providers for allied enterprises.
    
    Query parameters:
    - enterprise: str (required) - Enterprise type (fish, honey, mushroom, poultry, goat, vermicompost)
    - commodity: str (required) - Commodity name (e.g., "Rohu", "Raw Honey", "Button Mushroom")
    - state: str (optional) - State name
    - district: str (optional) - District name
    - market: str (optional) - Market name
    
    Returns:
    - Live market prices for allied enterprises where available
    - Units vary by commodity (kg for fish/honey, piece for eggs, etc.)
    
    Supported enterprises:
    - fish (NFDB FMPIS) - Status: NOT_AVAILABLE (API endpoint pending discovery)
    - honey (e-NAM) - Status: NOT_AVAILABLE (API endpoint pending discovery)
    - mushroom (e-NAM) - Status: NOT_AVAILABLE (API endpoint pending discovery)
    - poultry, goat, vermicompost - Status: NOT_AVAILABLE (providers pending implementation)
    
    Note: This is a new feature. Most providers are still in discovery phase.
    Real data will be available once official API endpoints are discovered and integrated.
    """
    try:
        price_data = await allied_market_service.fetch_allied_price(
            enterprise=enterprise,
            commodity=commodity,
            state=state,
            district=district,
            market=market
        )
        return price_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching allied market price: {str(e)}"
        )


@app.get("/api/v1/allied-enterprises", tags=["Allied Market"])
async def get_allied_enterprises():
    """
    Get list of supported allied enterprises.
    
    Returns:
    - List of enterprise types that have providers (even if data is not yet available)
    """
    try:
        enterprises = allied_market_service.get_supported_enterprises()
        return {
            "enterprises": enterprises,
            "total_count": len(enterprises),
            "note": "Some enterprises may have providers in discovery/implementation phase"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching enterprises: {str(e)}"
        )


@app.get("/api/v1/allied-commodities", tags=["Allied Market"])
async def get_allied_commodities(
    enterprise: str,
    state: Optional[str] = None
):
    """
    Get list of supported commodities for an allied enterprise.
    
    Query parameters:
    - enterprise: str (required) - Enterprise type
    - state: str (optional) - State filter
    
    Returns:
    - List of commodities available for the specified enterprise
    """
    try:
        commodities = await allied_market_service.get_supported_commodities(
            enterprise=enterprise,
            state=state
        )
        return {
            "enterprise": enterprise,
            "commodities": commodities,
            "total_count": len(commodities),
            "state": state
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching commodities: {str(e)}"
        )


@app.get("/api/v1/nearby-selling-points", tags=["Market Linkage"])
async def get_nearby_selling_points(
    product: str,
    location: str = "Kopergaon",
    radius: int = 5000
):
    """
    Find nearby selling points for a product using Mappls API.
    
    Query parameters:
    - product: str (required) - Product/commodity name (e.g., "Onion", "Milk", "Eggs")
    - location: str (optional, default="Kopergaon") - Location name
    - radius: int (optional, default=5000) - Search radius in meters (min: 500, max: 10000)
    
    Returns:
    - List of nearby selling points (markets, mandis, collection centres, buyers)
    - Each point includes: name, type, address, distance, contact details
    """
    try:
        from services.mappls_service import get_mappls_service
        
        # Default coordinates for Kopergaon, Maharashtra
        # In production, this could be looked up dynamically
        location_coords = {
            "kopergaon": (19.8826, 74.4764),
            "ahmednagar": (19.0948, 74.7480),
            "nashik": (19.9975, 73.7898),
            "mumbai": (19.0760, 72.8777),
            "pune": (18.5204, 73.8567)
        }
        
        # Get coordinates for location
        location_key = location.lower().strip()
        if location_key in location_coords:
            lat, lon = location_coords[location_key]
        else:
            # Default to Kopergaon
            lat, lon = location_coords["kopergaon"]
        
        # Get Mappls service
        mappls = get_mappls_service()
        
        # Find nearby selling points
        selling_points = await mappls.find_nearby_selling_points(
            product=product,
            latitude=lat,
            longitude=lon,
            radius=radius,
            max_results=15
        )
        
        return {
            "product": product,
            "location": location,
            "location_coords": {"latitude": lat, "longitude": lon},
            "radius_meters": radius,
            "selling_points": selling_points,
            "total_count": len(selling_points),
            "source": "mappls",
            "fetched_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error finding nearby selling points: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error finding nearby selling points: {str(e)}"
        )


@app.get("/api/v1/training", tags=["Training"])
async def get_training_modules(
    enterprise: Optional[str] = None,
    language: str = "marathi"
):
    """
    Get training modules for agricultural enterprises.
    
    Query parameters:
    - enterprise: str (optional) - Filter by enterprise type (e.g., apiculture, poultry)
    - language: str (optional, default=marathi) - Language for training content
    
    Returns:
    - List of training modules with topics, resources, and video links
    """
    try:
        if enterprise:
            modules = TrainingProvider.get_training_by_enterprise(enterprise, language)
        else:
            modules = TrainingProvider.get_all_training_modules()
            # Filter by language if no enterprise specified
            modules = [m for m in modules if m.get("language") == language]
        
        return {
            "training_modules": modules,
            "total_count": len(modules),
            "language": language,
            "enterprise": enterprise
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching training modules: {str(e)}"
        )


@app.post("/api/v1/advisory/recommend", tags=["Advisory"])
async def get_advisory_recommendations(request: AdvisoryRequest):
    """
    Get personalized enterprise recommendations based on farmer profile.
    
    Request body:
    - budget_rupees: int (required) - Available budget in rupees
    - land_size_hectares: float (required) - Available land in hectares
    - state: str (optional, default=maharashtra) - State location
    - experience_level: str (optional, default=beginner) - Experience level
    - goals: str (optional) - Farmer's goals and preferences
    
    Returns:
    - List of recommended enterprises with scores, schemes, and training
    """
    try:
        recommendations, summary = AdvisoryService.get_recommendations(
            budget_rupees=request.budget_rupees,
            land_size_hectares=request.land_size_hectares,
            state=request.state,
            experience_level=request.experience_level,
            goals=request.goals
        )
        
        return {
            "recommendations": [rec.dict() for rec in recommendations],
            "summary": summary,
            "farmer_profile": {
                "budget_rupees": request.budget_rupees,
                "land_size_hectares": request.land_size_hectares,
                "state": request.state,
                "experience_level": request.experience_level
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

