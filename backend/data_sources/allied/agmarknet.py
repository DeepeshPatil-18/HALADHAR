"""
Agmarknet Provider for Allied Commodities (Fish, Egg, Poultry, etc.)

Official Source: Government of India Open Data Platform (data.gov.in)
Dataset: Current Daily Price of Various Commodities from Various Markets (Mandi)
API Endpoint: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070

This provider connects to the official Agmarknet dataset for ALLIED commodities only.
Crop commodities continue to use the existing Farmer.in integration.

IMPORTANT SEPARATION:
- Crops → Farmer.in → mandi_source.py → /api/v1/mandi-price (UNTOUCHED)
- Allied → Agmarknet → this file → /api/v1/allied-price

Data Source: Agmarknet (Government of India Ministry of Agriculture)
Update Frequency: Daily
Coverage: Pan-India markets (APMCs)
"""

import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime
import os
from .base import AlliedMarketProvider


class AgmarknetAlliedProvider(AlliedMarketProvider):
    """
    Agmarknet Provider for Allied Agricultural Commodities.
    
    Fetches market prices for fish, eggs, poultry, and other allied products
    from the Government of India's Open Data Platform.
    """
    
    # Official API endpoint
    BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    
    # API key from environment or default (public key from GitHub examples)
    API_KEY = os.getenv("DATA_GOV_IN_API_KEY", "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b")
    
    # Allied commodities supported by Agmarknet
    # NOTE: Government API (data.gov.in) experiencing persistent timeouts as of Aug 2026
    # These commodities are EXPECTED to be available based on AGMARKNET dataset structure
    # but cannot be verified due to API unavailability.
    # 
    # Once API becomes responsive, this list should be updated based on actual API responses.
    # See: test_agmarknet_direct.py for verification methodology
    # 
    # DO NOT add commodities without API verification.
    # DO NOT remove these until verified unavailable.
    ALLIED_COMMODITIES = {
        "fish": [
            # Common fish species that SHOULD be in AGMARKNET
            # Pending verification once API becomes available
            "Fish",  # Generic category
            "Rohu",
            "Katla",
            "Mrigal",
            "Common Carp",
            "Hilsa",
            "Pomfret",
            "Mackerel",
            "Sardine",
            "Prawn",
            "Shrimp"
        ],
        "egg": [
            # Egg commodities that SHOULD be in AGMARKNET
            # Pending verification once API becomes available
            "Egg",  # Generic category
            "Hen Egg",
            "Duck Egg"
        ],
        "poultry": [
            # Poultry commodities that SHOULD be in AGMARKNET
            # Pending verification once API becomes available
            "Chicken",
            "Broiler",
            "Layer",
            "Country Chicken"
        ],
        "meat": [
            # Meat commodities that SHOULD be in AGMARKNET
            # Pending verification once API becomes available
            "Mutton",
            "Goat",
            "Lamb",
            "Buffalo Meat"
        ]
    }
    
    def __init__(self):
        """Initialize Agmarknet Allied Provider."""
        self.timeout = 15.0
    
    def get_supported_enterprises(self) -> List[str]:
        """
        Get list of enterprises supported by Agmarknet.
        
        Returns:
            List of enterprise types
        """
        return list(self.ALLIED_COMMODITIES.keys())
    
    async def get_supported_commodities(
        self,
        enterprise: str,
        state: Optional[str] = None
    ) -> List[str]:
        """
        Get list of commodities supported for an enterprise.
        
        Args:
            enterprise: Enterprise type (fish, egg, poultry, meat)
            state: Optional state filter (not used for static list)
            
        Returns:
            List of commodity names
        """
        enterprise_lower = enterprise.lower().strip()
        return self.ALLIED_COMMODITIES.get(enterprise_lower, [])
    
    async def fetch_price(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str] = None,
        district: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch allied commodity price from Agmarknet.
        
        API Filter Parameters:
        - filters[state]: State name (e.g., "Maharashtra")
        - filters[district]: District name (e.g., "Nashik")
        - filters[market]: Market name (e.g., "APMC Market")
        - filters[commodity]: Commodity name (e.g., "Egg", "Fish")
        - format: "json"
        - limit: Number of results
        - offset: Pagination offset
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            
        Returns:
            Normalized price data or NOT_AVAILABLE response
        """
        # Validate enterprise
        enterprise_lower = enterprise.lower().strip()
        if enterprise_lower not in self.ALLIED_COMMODITIES:
            return self._not_available_response(
                enterprise,
                commodity,
                state,
                district,
                market,
                f"Agmarknet does not support {enterprise} enterprise"
            )
        
        # Normalize state
        state_normalized = None
        if state:
            state_normalized = self._normalize_state_name(state)
        
        # Build API request
        params = {
            "api-key": self.API_KEY,
            "format": "json",
            "limit": "50",  # Get multiple records to find best match
            "offset": "0"
        }
        
        # Add filters
        filters = {}
        
        # Commodity filter (required)
        filters["commodity"] = commodity
        
        # State filter
        if state_normalized:
            filters["state"] = state_normalized
        
        # District filter
        if district:
            filters["district"] = district
        
        # Market filter
        if market:
            filters["market"] = market
        
        # Add filters to params (URL-encoded format: filters[key]=value)
        for key, value in filters.items():
            params[f"filters[{key}]"] = value
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(self.BASE_URL, params=params)
                
                # Handle rate limiting
                if response.status_code == 429:
                    return self._error_response(
                        enterprise,
                        commodity,
                        state_normalized,
                        district,
                        market,
                        "Rate limit exceeded. Please try again later."
                    )
                
                response.raise_for_status()
                data = response.json()
                
                # Parse response
                return self._parse_agmarknet_response(
                    data,
                    enterprise,
                    commodity,
                    state_normalized,
                    district,
                    market
                )
                
        except httpx.TimeoutException as e:
            return self._error_response(
                enterprise,
                commodity,
                state_normalized,
                district,
                market,
                "API request timed out. The government data portal may be slow or unavailable."
            )
        except httpx.HTTPStatusError as e:
            return self._error_response(
                enterprise,
                commodity,
                state_normalized,
                district,
                market,
                f"HTTP error {e.response.status_code}: {e.response.text[:100]}"
            )
        except httpx.RequestError as e:
            return self._error_response(
                enterprise,
                commodity,
                state_normalized,
                district,
                market,
                f"Network error: {type(e).__name__} - {str(e)}"
            )
        except Exception as e:
            return self._error_response(
                enterprise,
                commodity,
                state_normalized,
                district,
                market,
                f"Unexpected error: {type(e).__name__} - {str(e)}"
            )
    
    def _parse_agmarknet_response(
        self,
        data: Dict[str, Any],
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str]
    ) -> Dict[str, Any]:
        """
        Parse Agmarknet API response and normalize to our schema.
        
        Agmarknet Response Structure:
        {
            "total": 123,
            "count": 50,
            "records": [
                {
                    "state": "Maharashtra",
                    "district": "Nashik",
                    "market": "APMC Nashik",
                    "commodity": "Egg",
                    "variety": "Big",
                    "grade": "A",
                    "min_price": "4.50",
                    "max_price": "5.20",
                    "modal_price": "4.80",
                    "price_date": "25/08/2026",
                    "timestamp": "..."
                },
                ...
            ]
        }
        
        Args:
            data: Raw API response
            enterprise: Enterprise type
            commodity: Commodity name
            state: State filter
            district: District filter
            market: Market filter
            
        Returns:
            Normalized price data
        """
        records = data.get("records", [])
        
        if not records:
            return self._not_available_response(
                enterprise,
                commodity,
                state,
                district,
                market,
                "No market price data available for this commodity in the specified location."
            )
        
        # Use the most recent record
        # Records are typically ordered by date (most recent first)
        record = records[0]
        
        # Extract price data
        try:
            min_price = float(record.get("min_price", 0))
            max_price = float(record.get("max_price", 0))
            modal_price = float(record.get("modal_price", 0))
            
            # Use modal price as the primary price
            price = modal_price if modal_price > 0 else (min_price + max_price) / 2 if (min_price + max_price) > 0 else None
            
            if price is None or price == 0:
                return self._not_available_response(
                    enterprise,
                    commodity,
                    state,
                    district,
                    market,
                    "Price data is incomplete or zero."
                )
            
        except (ValueError, TypeError):
            return self._not_available_response(
                enterprise,
                commodity,
                state,
                district,
                market,
                "Price data is invalid or missing."
            )
        
        # Parse date
        price_date = record.get("price_date", "")
        try:
            # Agmarknet date format: DD/MM/YYYY
            date_parts = price_date.split("/")
            if len(date_parts) == 3:
                formatted_date = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}"
            else:
                formatted_date = datetime.utcnow().strftime("%Y-%m-%d")
        except:
            formatted_date = datetime.utcnow().strftime("%Y-%m-%d")
        
        # Determine unit (Agmarknet typically uses Quintal, but eggs might be per 100 or per kg)
        unit = "quintal"  # Default
        commodity_lower = commodity.lower()
        if "egg" in commodity_lower:
            unit = "100 pieces"
        elif "chicken" in commodity_lower or "fish" in commodity_lower or "mutton" in commodity_lower or "goat" in commodity_lower:
            unit = "kg"
        
        # Build normalized response
        return {
            "category": "allied",
            "enterprise": enterprise,
            "commodity": commodity,
            "availability": "available",
            "price": round(price, 2),
            "min_price": round(min_price, 2) if min_price > 0 else None,
            "max_price": round(max_price, 2) if max_price > 0 else None,
            "unit": unit,
            "state": record.get("state"),
            "district": record.get("district"),
            "market": record.get("market"),
            "variety": record.get("variety"),
            "grade": record.get("grade"),
            "date": formatted_date,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "Agmarknet",
            "data_source": "Government of India Open Data Platform (data.gov.in)"
        }
    
    def _not_available_response(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str],
        message: str
    ) -> Dict[str, Any]:
        """
        Generate NOT_AVAILABLE response.
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            message: Reason message
            
        Returns:
            NOT_AVAILABLE response dict
        """
        return {
            "category": "allied",
            "enterprise": enterprise,
            "commodity": commodity,
            "availability": "not_available",
            "message": message,
            "state": state,
            "district": district,
            "market": market,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "Agmarknet"
        }
    
    def _error_response(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str],
        error_message: str
    ) -> Dict[str, Any]:
        """
        Generate error response.
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            error_message: Error description
            
        Returns:
            Error response dict
        """
        return {
            "category": "allied",
            "enterprise": enterprise,
            "commodity": commodity,
            "availability": "error",
            "message": f"Error fetching data: {error_message}",
            "state": state,
            "district": district,
            "market": market,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "Agmarknet"
        }
