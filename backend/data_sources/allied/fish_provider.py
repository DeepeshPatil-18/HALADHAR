"""
Fish Provider for Allied Market Prices

Status: NOT_AVAILABLE
Reason: No reliable data source discovered yet.

NFDB FMPIS was investigated but no public API endpoint found.
This provider is ready to integrate with a real data source once identified.
Do NOT generate fake prices.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from .base import AlliedMarketProvider


class FishProvider(AlliedMarketProvider):
    """
    Provider for fish/aquaculture market prices.
    
    Status: NOT_AVAILABLE (awaiting reliable data source)
    Investigated: NFDB FMPIS (no public API found)
    """
    
    def get_supported_enterprises(self) -> List[str]:
        """Fish provider supports 'fish' enterprise."""
        return ["fish"]
    
    async def get_supported_commodities(
        self,
        enterprise: str,
        state: Optional[str] = None
    ) -> List[str]:
        """
        Get list of fish commodities.
        
        Args:
            enterprise: Should be "fish"
            state: Optional state filter
            
        Returns:
            List of fish species
        """
        if enterprise != "fish":
            return []
        
        return [
            "Fish",
            "Rohu",
            "Katla",
            "Mrigal",
            "Common Carp",
            "Tilapia",
            "Pangasius",
            "Pomfret",
            "Hilsa",
            "Mackerel",
            "Sardine",
            "Prawn",
            "Shrimp"
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
        Fetch fish price data.
        
        Current Status: NOT_AVAILABLE (no reliable data source)
        
        Args:
            enterprise: Should be "fish"
            commodity: Fish species
            state: State name
            district: District name
            market: Market name
            
        Returns:
            NOT_AVAILABLE response
        """
        if enterprise != "fish":
            return {
                "category": "allied",
                "enterprise": enterprise,
                "commodity": commodity,
                "availability": "not_available",
                "message": f"Fish provider only supports 'fish' enterprise, not '{enterprise}'.",
                "source": "FishProvider"
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
            "message": "Fish market price data source not yet integrated. NFDB FMPIS investigated but no public API found.",
            "state": state_normalized,
            "district": district,
            "market": market,
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "FishProvider",
            "note": "Provider ready for integration once reliable data source is identified. NFDB FMPIS: https://nfdb.gov.in/"
        }
