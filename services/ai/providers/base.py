"""
Base AI Provider Interface
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class AIProvider(ABC):
    """
    Abstract base class for AI providers (Mistral, Kisan SLM, etc.)
    """
    
    @abstractmethod
    async def generate_response(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        language: str = "hi",
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate AI response for a given message
        
        Args:
            message: User's input message
            conversation_history: List of previous messages [{"role": "user/assistant", "content": "..."}]
            language: Language code (hi, mr, en)
            context: Additional context (location, crops, weather, etc.)
            
        Returns:
            AI-generated response text
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """Get the name of this provider"""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if this provider is available and configured"""
        pass
