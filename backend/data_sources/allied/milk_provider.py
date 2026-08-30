"""
Milk Provider for Allied Market Prices

Status: NOT_AVAILABLE
Reason: No reliable data source discovered yet.

This provider is ready to integrate with a real data source once identified.
Do NOT generate fake prices.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from .base import AlliedMarketProvider


class MilkProvider(AlliedMarketProvider):
    """
    Provider for milk/dairy market prices.
    
    Status: NOT_AVAILABLE (awaiting reliable data source)
    """
    
    def get_supported_enterprises(self) -> List[str]:
        """Milk provider supports 'milk' enterprise."""
        return ["milk"]
    
    async def get_supported_commodities(
        self,
        enterprise: str,
        state: Optional[str] = None
    ) -> List[str]:
        """
        Get list of milk/dairy commodities.
        
        Args:
            enterprise: Should be "milk"
            state: Optional state filter
            
        Returns:
            List of milk/dairy types
        """
        if enterprise != "milk":
            return []
        
        return [
            "Milk",
            "Cow Milk",
            "Buffalo Milk",
            "Goat Milk",
            "Curd",
            "Butter",
            "Ghee"
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
        Fetch milk/dairy price data.
        
        Current Status: NOT_AVAILABLE (no reliable data source)
        
        Args:
            enterprise: Should be "milk"
            commodity: Milk/dairy type
            state: State name
            district: District name
            market: Market name
            
        Returns:
            NOT_AVAILABLE response
        """
        if enterprise != "milk":
            return {
                "category": "allied",
                "enterprise": enterprise,
                "commodity": commodity,
                "availability": "not_available",
                "message": f"Milk provider only supports 'milk' enterprise, not '{enterprise}'.",
                "source": "MilkProvider"
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
            "message": "Milk market price data source not yet integrated. Reliable data source pending discovery.",
            "state": state_normalized,
            "district": district,
            "market": market,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "MilkProvider",
            "note": "Provider ready for integration once reliable data source is identified."
        }
