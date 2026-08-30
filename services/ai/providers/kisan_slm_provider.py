"""
Kisan SLM Provider (Placeholder for Future)
"""

from typing import List, Dict, Any, Optional
from .base import AIProvider


class KisanSLMProvider(AIProvider):
    """
    Kisan SLM provider placeholder
    
    This provider will be implemented in the future when Kisan SLM API is available.
    For now, it returns NotImplementedError to maintain clean architecture.
    """
    
    def __init__(self):
        self.api_key = None  # Will be configured later
        
    def get_provider_name(self) -> str:
        return "Kisan SLM"
    
    def is_available(self) -> bool:
        """Kisan SLM is not yet available"""
        return False
    
    async def generate_response(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        language: str = "hi",
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Kisan SLM implementation will be added in the future
        """
        raise NotImplementedError(
            "Kisan SLM provider is not yet implemented. "
            "The system is currently using Mistral as the AI provider."
        )
