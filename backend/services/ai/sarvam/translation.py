"""
Sarvam Translation Services
Translation between Indian languages
"""

import os
import httpx
from typing import Optional


class SarvamTranslation:
    """
    Sarvam Translation Services
    Translate between Indian languages
    """
    
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.api_base = "https://api.sarvam.ai"
        self.timeout = 15.0
        
    def is_available(self) -> bool:
        """Check if Sarvam API is configured"""
        return bool(self.api_key)
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> dict:
        """
        Translate text between languages using Sarvam
        
        This will be implemented when translation is needed.
        Architecture ready for future use.
        
        Args:
            text: Text to translate
            source_language: Source language code (hi-IN, mr-IN, etc.)
            target_language: Target language code
            
        Returns:
            {
                "translated_text": "translated content",
                "source_language": "hi-IN",
                "target_language": "en-IN"
            }
        """
        
        if not self.is_available():
            raise ValueError("Sarvam API key not configured")
        
        # Placeholder for future implementation
        # For now, return original text
        return {
            "translated_text": text,
            "source_language": source_language,
            "target_language": target_language,
            "note": "Translation service will be implemented when needed"
        }
    
    def get_supported_language_pairs(self) -> list:
        """
        Get supported translation language pairs
        """
        languages = ["hi-IN", "mr-IN", "en-IN", "bn-IN", "ta-IN", "te-IN", "kn-IN", "gu-IN", "pa-IN", "ml-IN", "or-IN"]
        
        pairs = []
        for source in languages:
            for target in languages:
                if source != target:
                    pairs.append({
                        "source": source,
                        "target": target
                    })
        
        return pairs


# Global translation service instance
sarvam_translation = SarvamTranslation()
