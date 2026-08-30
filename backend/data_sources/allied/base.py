"""
Base provider interface for allied agricultural market data.

This defines the contract that all allied market data providers must follow.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class AlliedMarketProvider(ABC):
    """
    Abstract base class for allied market data providers.
    
    Each provider (NFDB FMPIS, e-NAM, etc.) must implement this interface
    to ensure consistent data access and normalization.
    """
    
    @abstractmethod
    async def fetch_price(
        self,
        enterprise: str,
        commodity: str,
        state: Optional[str] = None,
        district: Optional[str] = None,
        market: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetch market price data for an allied enterprise commodity.
        
        Args:
            enterprise: Enterprise type (fish, honey, mushroom, poultry, goat, vermicompost)
            commodity: Specific commodity name (e.g., "Rohu", "Raw Honey", "Button Mushroom")
            state: Optional state filter
            district: Optional district filter
            market: Optional market name filter
            
        Returns:
            Normalized dictionary with price data and metadata
            
            Example success response:
            {
                "category": "allied",
                "enterprise": "fish",
                "commodity": "Rohu",
                "availability": "available",
                "price": 180,
                "min_price": 150,
                "max_price": 220,
                "unit": "kg",
                "state": "Maharashtra",
                "district": "Nashik",
                "market": "FMPIS Market Name",
                "date": "2026-08-26",
                "fetched_at": "2026-08-26T10:30:00",
                "source": "NFDB FMPIS"
            }
            
            Example unavailable response:
            {
                "category": "allied",
                "enterprise": "fish",
                "commodity": "Rohu",
                "availability": "not_available",
                "message": "Live market price unavailable for this activity in your area.",
                "state": "Maharashtra",
                "district": "Nashik",
                "source": "NFDB FMPIS"
            }
        """
        pass
    
    @abstractmethod
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
            List of commodity names available from this provider
        """
        pass
    
    @abstractmethod
    def get_supported_enterprises(self) -> List[str]:
        """
        Get list of enterprises supported by this provider.
        
        Returns:
            List of enterprise types (e.g., ["fish", "honey"])
        """
        pass
    
    @staticmethod
    def _normalize_state_name(state: str) -> str:
        """
        Normalize state name to match provider conventions.
        
        Args:
            state: State name or abbreviation
            
        Returns:
            Standardized state name
        """
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
        return state_map.get(state.lower().strip(), state)
    
    @staticmethod
    def _validate_price_data(data: Dict[str, Any]) -> bool:
        """
        Validate that price data contains required fields.
        
        Args:
            data: Price data dictionary
            
        Returns:
            True if valid, False otherwise
        """
        required_fields = ["commodity", "enterprise", "availability"]
        
        for field in required_fields:
            if field not in data:
                return False
        
        # If available, must have price data
        if data.get("availability") == "available":
            price_fields = ["price", "unit", "date"]
            for field in price_fields:
                if field not in data or data[field] is None:
                    return False
        
        return True
