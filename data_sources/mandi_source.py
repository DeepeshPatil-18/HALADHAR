"""
Mandi price source using Farmer.in Open API (free, keyless API)

Primary Provider: Farmer.in (https://www.farmer.in/api/open/prices.json)
Fallback Provider: mandi-api (https://mandi-api.onrender.com/v1/prices)

Data flow: Farmer.in → normalized response
Attribution: Data sourced from Agmarknet / Government of India via Farmer.in
OpenAPI: https://www.farmer.in/openapi.json
"""

import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta


class FarmerInSource:
    """Fetches mandi prices from Farmer.in Open API (Primary Provider)"""
    
    BASE_URL = "https://www.farmer.in/api/open/prices.json"
    
    # Cache for the full commodity list (to avoid repeated API calls)
    _cached_data: Optional[Dict[str, Any]] = None
    _cache_timestamp: Optional[datetime] = None
    _cache_ttl_hours = 6  # Cache data for 6 hours
    
    @staticmethod
    async def _fetch_all_commodities() -> Dict[str, Any]:
        """
        Fetch all commodities from Farmer.in API with caching and retry logic.
        Cache expires after 6 hours.
        """
        now = datetime.utcnow()
        
        # Return cached data if valid
        if (FarmerInSource._cached_data is not None and 
            FarmerInSource._cache_timestamp is not None and
            now - FarmerInSource._cache_timestamp < timedelta(hours=FarmerInSource._cache_ttl_hours)):
            return FarmerInSource._cached_data
        
        # Fetch fresh data with reduced timeout and single retry
        max_retries = 1  # Reduced from 3
        retry_delay = 0.5  # Reduced from 1 second
        
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:  # Increased timeout for initial fetch
                    response = await client.get(FarmerInSource.BASE_URL)
                    response.raise_for_status()
                    data = response.json()
                    
                    # Cache the response
                    FarmerInSource._cached_data = data
                    FarmerInSource._cache_timestamp = now
                    
                    return data
            except (httpx.HTTPStatusError, httpx.RequestError, httpx.TimeoutException) as e:
                if attempt == max_retries - 1:
                    # Last attempt failed, raise the error
                    raise Exception(f"Farmer.in API unavailable: {str(e)}")
                # Wait before retrying
                import asyncio
                await asyncio.sleep(retry_delay)
    
    @staticmethod
    async def fetch_mandi_prices(
        commodity: str,
        state: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch mandi prices from Farmer.in API.
        
        Args:
            commodity: Commodity name (e.g., "Onion", "Wheat", "Rice")
            state: Optional state filter (searches major_states field)
            market: Optional market/district filter (not directly supported, included for API compatibility)
            
        Returns:
            Normalized dictionary with prices array and metadata
            
        Raises:
            Exception: If API request fails or commodity not found
        """
        # Fetch all commodities data
        data = await FarmerInSource._fetch_all_commodities()
        
        # Search for matching commodity (case-insensitive)
        commodity_lower = commodity.lower().strip()
        matching_commodity = None
        
        for comm in data.get("commodities", []):
            # Match by name, id, or hindi name
            if (comm.get("name", "").lower() == commodity_lower or
                comm.get("id", "").lower() == commodity_lower or
                comm.get("hindi", "").lower() == commodity_lower):
                matching_commodity = comm
                break
        
        # If not found, return "data unavailable" response
        if not matching_commodity:
            return {
                "prices": [],
                "total_count": 0,
                "source": "farmer.in",
                "commodity": commodity,
                "state": state or "ALL",
                "market": market or "ALL",
                "latest_updated": data.get("updated", datetime.utcnow().isoformat()),
                "raw_count": 0,
                "availability": "not_available",
                "message": f"No price data available for commodity: {commodity}"
            }
        
        # Filter by state if provided (informational only - don't block based on major_states)
        # The Farmer.in API returns state-level aggregated data for all commodities
        # major_states is just metadata about where the crop is commonly grown
        if state:
            state_normalized = FarmerInSource._normalize_state_name(state)
        
        # Normalize to our schema
        normalized_price = FarmerInSource._normalize_price(matching_commodity, state, market)
        
        return {
            "prices": [normalized_price],
            "total_count": 1,
            "source": "farmer.in",
            "commodity": commodity,
            "state": state or "ALL",
            "market": market or "ALL",
            "latest_updated": matching_commodity.get("updated", data.get("updated", "")),
            "raw_count": matching_commodity.get("mkts", 0),
            "availability": "available"
        }
    
    @staticmethod
    def _normalize_state_name(state: str) -> str:
        """Normalize state name to match Farmer.in conventions"""
        state_map = {
            "maharashtra": "Maharashtra",
            "mh": "Maharashtra",
            "uttar pradesh": "Uttar Pradesh",
            "up": "Uttar Pradesh",
            "punjab": "Punjab",
            "pb": "Punjab",
            "madhya pradesh": "Madhya Pradesh",
            "mp": "Madhya Pradesh",
            "karnataka": "Karnataka",
            "ka": "Karnataka",
            "kn": "Karnataka",
            "tamil nadu": "Tamil Nadu",
            "tn": "Tamil Nadu",
            "andhra pradesh": "Andhra Pradesh",
            "ap": "Andhra Pradesh",
            "telangana": "Telangana",
            "ts": "Telangana",
            "gujarat": "Gujarat",
            "gj": "Gujarat",
            "rajasthan": "Rajasthan",
            "rj": "Rajasthan",
            "haryana": "Haryana",
            "hr": "Haryana",
            "west bengal": "West Bengal",
            "wb": "West Bengal",
            "bihar": "Bihar",
            "br": "Bihar",
            "odisha": "Odisha",
            "or": "Odisha",
            "kerala": "Kerala",
            "kl": "Kerala",
        }
        return state_map.get(state.lower(), state)
    
    @staticmethod
    def _normalize_price(commodity: Dict[str, Any], state: Optional[str], market: Optional[str]) -> Dict[str, Any]:
        """
        Normalize Farmer.in commodity data to our market_prices schema.
        
        Farmer.in fields:
        - id, name, hindi, icon, category, price, min, max, unit, change, trend
        - major_states, season, msp, description, varieties, uses, mkts, updated
        
        Our schema:
        - commodity, state, district, market, variety, grade
        - price_per_quintal, min_price, max_price
        - date, source
        """
        # Extract relevant fields
        comm_name = commodity.get("name", "")
        price = commodity.get("price", 0)
        min_price = commodity.get("min", 0)
        max_price = commodity.get("max", 0)
        updated = commodity.get("updated", "")
        major_states = commodity.get("major_states", [])
        
        # Determine state to display
        display_state = state if state else (major_states[0] if major_states else "")
        
        normalized_price = {
            "commodity": comm_name,
            "state": display_state,
            "district": "",  # Not provided by Farmer.in
            "market": market or "",  # Market filter not directly supported
            "variety": "",  # Not granular in Farmer.in
            "grade": "",  # Not provided
            "price_per_quintal": price,
            "min_price": min_price,
            "max_price": max_price,
            "date": updated,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "farmer.in (Agmarknet via farmer.in)",
            "trend": commodity.get("trend", ""),
            "change": commodity.get("change", 0),
            "unit": commodity.get("unit", "quintal"),
            "msp": commodity.get("msp"),
            "season": commodity.get("season", ""),
            "major_states": major_states,
            "markets_count": commodity.get("mkts", 0)
        }
        
        return normalized_price
    
    @staticmethod
    async def get_supported_commodities(state: Optional[str] = None) -> List[str]:
        """
        Get list of available commodities from Farmer.in API.
        
        Args:
            state: Optional state to filter commodities (checks major_states field)
            
        Returns:
            List of commodity names
        """
        data = await FarmerInSource._fetch_all_commodities()
        commodities = []
        
        for comm in data.get("commodities", []):
            # If state filter is provided, only include commodities where state is in major_states
            if state:
                state_normalized = FarmerInSource._normalize_state_name(state)
                major_states = comm.get("major_states", [])
                if major_states and state_normalized not in major_states:
                    continue
            
            commodities.append(comm.get("name", ""))
        
        return sorted(commodities)


class MandiAPISource:
    """Fetches mandi prices from mandi-api (Fallback Provider)"""
    
    BASE_URL = "https://mandi-api.onrender.com/v1/prices"
    
    # Supported states
    SUPPORTED_STATES = [
        "Maharashtra",
        "Uttar Pradesh",
        "Punjab",
        "Madhya Pradesh",
        "Karnataka"
    ]
    
    @staticmethod
    async def fetch_mandi_prices(
        commodity: str,
        state: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch mandi prices from mandi-api (fallback provider).
        
        Args:
            commodity: Commodity name (e.g., "Onion", "Wheat", "Rice")
            state: Optional state filter (Maharashtra, UP, Punjab, MP, Karnataka)
            market: Optional market/district filter
            
        Returns:
            Normalized dictionary with prices array and metadata
            
        Raises:
            Exception: If API request fails
        """
        params = {
            "commodity": commodity
        }
        
        # Add state filter if provided and supported
        if state:
            # Normalize state name
            state_normalized = MandiAPISource._normalize_state_name(state)
            if state_normalized in MandiAPISource.SUPPORTED_STATES:
                params["state"] = state_normalized
        
        # Market filter is applied after fetching (API doesn't support market param directly)
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(MandiAPISource.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("success"):
                raise Exception("API returned unsuccessful response")
            
            raw_prices = data.get("data", [])
            meta = data.get("meta", {})
            
            # Filter by market/district if specified
            if market:
                market_lower = market.lower()
                raw_prices = [
                    p for p in raw_prices
                    if (market_lower in p.get("market", "").lower() or
                        market_lower in p.get("district", "").lower())
                ]
            
            # Normalize prices to our schema
            normalized_prices = MandiAPISource._normalize_prices(raw_prices)
            
            return {
                "prices": normalized_prices,
                "total_count": len(normalized_prices),
                "source": "mandi-api (fallback provider)",
                "commodity": commodity,
                "state": state or "ALL",
                "market": market or "ALL",
                "latest_updated": meta.get("latest_fetched_at", datetime.utcnow().isoformat()),
                "raw_count": meta.get("count", len(raw_prices))
            }
    
    @staticmethod
    def _normalize_state_name(state: str) -> str:
        """Normalize state name to match API expectations"""
        state_map = {
            "maharashtra": "Maharashtra",
            "mh": "Maharashtra",
            "uttar pradesh": "Uttar Pradesh",
            "up": "Uttar Pradesh",
            "punjab": "Punjab",
            "pb": "Punjab",
            "madhya pradesh": "Madhya Pradesh",
            "mp": "Madhya Pradesh",
            "karnataka": "Karnataka",
            "ka": "Karnataka",
            "kn": "Karnataka"
        }
        return state_map.get(state.lower(), state)
    
    @staticmethod
    def _normalize_prices(raw_prices: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalize raw API response to our market_prices schema.
        
        API fields:
        - id, state, district, market, commodity, variety, grade
        - arrival_date, min_price, max_price, modal_price, fetched_at
        
        Our schema:
        - commodity, state, district, market, variety, grade
        - price_per_quintal (use modal_price), min_price, max_price
        - date (arrival_date), source
        """
        normalized = []
        
        for price in raw_prices:
            normalized_price = {
                "commodity": price.get("commodity", ""),
                "state": price.get("state", ""),
                "district": price.get("district", ""),
                "market": price.get("market", ""),
                "variety": price.get("variety", ""),
                "grade": price.get("grade", ""),
                "price_per_quintal": price.get("modal_price", 0),
                "min_price": price.get("min_price", 0),
                "max_price": price.get("max_price", 0),
                "date": price.get("arrival_date", ""),
                "fetched_at": price.get("fetched_at", ""),
                "source": "AGMARKNET (via mandi-api fallback)"
            }
            normalized.append(normalized_price)
        
        return normalized
    
    @staticmethod
    async def get_supported_commodities(state: Optional[str] = None) -> List[str]:
        """
        Get list of available commodities (placeholder for mandi-api).
        
        Args:
            state: Optional state to get commodities for
            
        Returns:
            List of commodity names (common commodities in Indian mandis)
        """
        # Common commodities in Indian mandis
        # In production, you might want to make a discovery call or maintain a cache
        return [
            "Onion", "Potato", "Tomato", "Wheat", "Rice", "Bajra",
            "Jowar", "Maize", "Soyabean", "Cotton", "Groundnut",
            "Sugarcane", "Mustard", "Sunflower", "Arhar", "Moong",
            "Urad", "Chickpea", "Turmeric", "Chilli", "Coriander"
        ]


# Primary Source: Use Farmer.in as the main provider
MandiSource = FarmerInSource