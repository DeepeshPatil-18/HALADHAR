"""
Poultry Provider for Allied Market Prices

Status: NOT_AVAILABLE
Reason: No reliable data source discovered yet.

This provider is ready to integrate with a real data source once identified.
Do NOT generate fake prices.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from .base import AlliedMarketProvider


class PoultryProvider(AlliedMarketProvider):
    """
    Provider for poultry/chicken market prices.
    
    Status: NOT_AVAILABLE (awaiting reliable data source)
    """
    
    def get_supported_enterprises(self) -> List[str]:
        """Poultry provider supports 'poultry' enterprise."""
        return ["poultry"]
    
    async def get_supported_commodities(
        self,
        enterprise: str,
        state: Optional[str] = None
    ) -> List[str]:
        """
        Get list of poultry commodities.
        
        Args:
            enterprise: Should be "poultry"
            state: Optional state filter
            
        Returns:
            List of poultry types
        """
        if enterprise != "poultry":
            return []
        
        return [
            "Chicken",
            "Broiler",
            "Layer",
            "Country Chicken",
            "Hen"
        ]
    
    async def fetch_price(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str] = None,
        district: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch poultry price data.
        
        Current Status: NOT_AVAILABLE (no reliable data source)
        
        Args:
            enterprise: Should be "poultry"
            commodity: Poultry type
            state: State name
            district: District name
            market: Market name
            
        Returns:
            NOT_AVAILABLE response
        """
        if enterprise != "poultry":
            return {
                "category": "allied",
                "enterprise": enterprise,
                "commodity": commodity,
                "availability": "not_available",
                "message": f"Poultry provider only supports 'poultry' enterprise, not '{enterprise}'.",
                "source": "PoultryProvider"
            }
        
        # Normalize state if provided
        state_normalized = None
        if state:
            state_normalized = self._normalize_state_name(state)
        
        # Return NOT_AVAILABLE until real data source is integrated
        return {
            "category": "allied",
            "enterprise": enterprise,
            "commodity": commodity,
            "availability": "not_available",
            "message": "Poultry market price data source not yet integrated. Reliable data source pending discovery.",
            "state": state_normalized,
            "district": district,
            "market": market,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "PoultryProvider",
            "note": "Provider ready for integration once reliable data source is identified."
        }
