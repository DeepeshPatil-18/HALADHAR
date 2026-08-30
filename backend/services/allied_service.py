"""
Allied Market Service

This service routes allied enterprise market-price requests to the appropriate provider.
Separate from the existing mandi/crop system.

PROVIDER-BASED ARCHITECTURE:
Each allied category has its own dedicated provider that can use
its own reliable data source.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Import allied providers
from data_sources.allied.egg_provider import EggProvider
from data_sources.allied.poultry_provider import PoultryProvider
from data_sources.allied.fish_provider import FishProvider
from data_sources.allied.meat_provider import MeatProvider
from data_sources.allied.milk_provider import MilkProvider
from data_sources.allied.enam import ENAMProvider  # For honey, mushroom


class AlliedMarketService:
    """
    Service for managing allied agricultural market data.
    
    Routes requests to category-specific providers.
    Each provider can use its own reliable data source.
    """
    
    def __init__(self):
        # Initialize category-specific providers
        self.egg_provider = EggProvider()
        self.poultry_provider = PoultryProvider()
        self.fish_provider = FishProvider()
        self.meat_provider = MeatProvider()
        self.milk_provider = MilkProvider()
        
        # Fallback providers for other categories
        self.enam_provider = ENAMProvider()  # For honey, mushroom (NOT_AVAILABLE)
        
        # Cache for price data
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl_minutes = 30  # Cache for 30 minutes
    
    def _get_provider_for_enterprise(self, enterprise: str):
        """
        Determine which provider to use for a given enterprise.
        
        Each enterprise routes to its own dedicated provider.
        
        Args:
            enterprise: Enterprise type (egg, poultry, fish, meat, milk, honey, mushroom)
            
        Returns:
            Appropriate provider instance or None
        """
        enterprise_lower = enterprise.lower().strip()
        
        # Route to category-specific providers
        if enterprise_lower == "egg":
            return self.egg_provider
        elif enterprise_lower == "poultry":
            return self.poultry_provider
        elif enterprise_lower == "fish":
            return self.fish_provider
        elif enterprise_lower in ["meat", "goat"]:
            return self.meat_provider
        elif enterprise_lower == "milk":
            return self.milk_provider
        
        # Fallback providers (currently return NOT_AVAILABLE)
        elif enterprise_lower in ["honey", "mushroom"]:
            return self.enam_provider
        
        # Unsupported enterprises
        elif enterprise_lower == "vermicompost":
            # Vermicompost is not a market commodity
            return None
        else:
            return None
    
    def _get_cache_key(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str]
    ) -> str:
        """
        Generate cache key for price data.
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            
        Returns:
            Cache key string
        """
        key_parts = [
            enterprise.lower(),
            commodity.lower(),
            (state or "").lower(),
            (district or "").lower(),
            (market or "").lower()
        ]
        return "|".join(key_parts)
    
    def _get_from_cache(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve price data from cache if available and not expired.
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            
        Returns:
            Cached data if available and fresh, None otherwise
        """
        cache_key = self._get_cache_key(enterprise, commodity, state, district, market)
        
        if cache_key in self._cache:
            cached_entry = self._cache[cache_key]
            cached_time = cached_entry.get("cached_at")
            
            if cached_time:
                time_diff = datetime.utcnow() - cached_time
                if time_diff < timedelta(minutes=self._cache_ttl_minutes):
                    return cached_entry.get("data")
        
        return None
    
    def _save_to_cache(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str],
        district: Optional[str],
        market: Optional[str],
        data: Dict[str, Any]
    ):
        """
        Save price data to cache.
        
        Args:
            enterprise: Enterprise type
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            data: Price data to cache
        """
        cache_key = self._get_cache_key(enterprise, commodity, state, district, market)
        
        self._cache[cache_key] = {
            "data": data,
            "cached_at": datetime.utcnow()
        }
    
    async def fetch_allied_price(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str] = None,
        district: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch allied market price data.
        
        Routes to appropriate provider, manages caching, and returns normalized data.
        
        Args:
            enterprise: Enterprise type (fish, honey, mushroom, poultry, goat, vermicompost)
            commodity: Commodity name
            state: State name
            district: District name
            market: Market name
            
        Returns:
            Normalized price data or NOT_AVAILABLE response
        """
        # Check cache first
        cached_data = self._get_from_cache(enterprise, commodity, state, district, market)
        if cached_data:
            return cached_data
        
        # Get appropriate provider
        provider = self._get_provider_for_enterprise(enterprise)
        
        if provider is None:
            # No provider available for this enterprise
            return {
                "category": "allied",
                "enterprise": enterprise,
                "commodity": commodity,
                "availability": "not_available",
                "message": f"Market price provider not available for {enterprise} enterprise.",
                "state": state,
                "district": district,
                "market": market,
                "fetched_at": datetime.utcnow().isoformat(),
                "note": "Provider implementation pending or enterprise not supported."
            }
        
        try:
            # Fetch from provider
            price_data = await provider.fetch_price(
                enterprise=enterprise,
                commodity=commodity,
                state=state,
                district=district,
                market=market
            )
            
            # Cache the result
            self._save_to_cache(enterprise, commodity, state, district, market, price_data)
            
            return price_data
            
        except Exception as e:
            # Handle provider errors
            return {
                "category": "allied",
                "enterprise": enterprise,
                "commodity": commodity,
                "availability": "error",
                "message": f"Error fetching price data: {str(e)}",
                "state": state,
                "district": district,
                "market": market,
                "fetched_at": datetime.utcnow().isoformat(),
                "source": provider.__class__.__name__
            }
    
    async def get_supported_commodities(
        self,
        enterprise: str,
        state: Optional[str] = None
    ) -> List[str]:
        """
        Get list of supported commodities for an enterprise.
        
        Args:
            enterprise: Enterprise type
            state: Optional state filter
            
        Returns:
            List of commodity names
        """
        provider = self._get_provider_for_enterprise(enterprise)
        
        if provider is None:
            return []
        
        try:
            commodities = await provider.get_supported_commodities(enterprise, state)
            return commodities
        except Exception:
            return []
    
    def get_supported_enterprises(self) -> List[str]:
        """
        Get list of all supported enterprise types.
        
        Returns:
            List of enterprise names
        """
        # Combine supported enterprises from all providers
        enterprises = set()
        
        # Category-specific providers
        enterprises.update(self.egg_provider.get_supported_enterprises())
        enterprises.update(self.poultry_provider.get_supported_enterprises())
        enterprises.update(self.fish_provider.get_supported_enterprises())
        enterprises.update(self.meat_provider.get_supported_enterprises())
        enterprises.update(self.milk_provider.get_supported_enterprises())
        
        # Fallback providers
        enterprises.update(self.enam_provider.get_supported_enterprises())
        
        # Add enterprises that don't have providers
        pending_enterprises = ["vermicompost"]  # Not a market commodity
        
        return sorted(list(enterprises) + pending_enterprises)
