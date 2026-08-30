"""
Sarvam Language Services
Language identification and utilities
"""

import os
import httpx
from typing import Optional


class SarvamLanguage:
    """
    Sarvam Language Services
    Language detection and identification
    """
    
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.api_base = "https://api.sarvam.ai"
        self.timeout = 10.0
        
    def is_available(self) -> bool:
        """Check if Sarvam API is configured"""
        return bool(self.api_key)
    
    async def detect_language(
        self,
        text: str
    ) -> dict:
        """
        Detect language of given text
        
        This will be implemented when Sarvam provides language detection API.
        For now, uses simple heuristics.
        
        Args:
            text: Input text
            
        Returns:
            {
                "language": "hi-IN",
                "confidence": 0.95,
                "script": "devanagari"
            }
        """
        
        # Simple heuristic-based detection for now
        return self._heuristic_language_detection(text)
    
    def _heuristic_language_detection(self, text: str) -> dict:
        """
        Simple heuristic-based language detection
        Based on Unicode script ranges
        """
        
        # Count characters from different scripts
        devanagari_count = sum(1 for c in text if '\u0900' <= c <= '\u097F')
        latin_count = sum(1 for c in text if 'a' <= c.lower() <= 'z')
        
        total_chars = len([c for c in text if c.isalpha()])
        
        if total_chars == 0:
            return {"language": "hi-IN", "confidence": 0.5, "script": "unknown"}
        
        # Detect based on script
        if devanagari_count / total_chars > 0.3:
            # Devanagari script - could be Hindi or Marathi
            # Default to Hindi (Marathi detection would need more sophisticated analysis)
            return {
                "language": "hi-IN",
                "confidence": 0.8,
                "script": "devanagari"
            }
        elif latin_count / total_chars > 0.5:
            # Latin script - English or transliterated Indian language
            return {
                "language": "en-IN",
                "confidence": 0.7,
                "script": "latin"
            }
        else:
            # Default to Hindi
            return {
                "language": "hi-IN",
                "confidence": 0.5,
                "script": "unknown"
            }
    
    def normalize_language_code(
        self,
        language: str
    ) -> str:
        """
        Normalize language code to Sarvam format
        
        Examples:
            "hi" -> "hi-IN"
            "hindi" -> "hi-IN"
            "mr" -> "mr-IN"
            "en" -> "en-IN"
        """
        
        language_map = {
            "hi": "hi-IN",
            "hindi": "hi-IN",
            "हिंदी": "hi-IN",
            "mr": "mr-IN",
            "marathi": "mr-IN",
            "मराठी": "mr-IN",
            "en": "en-IN",
            "english": "en-IN",
            "bn": "bn-IN",
            "bengali": "bn-IN",
            "ta": "ta-IN",
            "tamil": "ta-IN",
            "te": "te-IN",
            "telugu": "te-IN",
            "kn": "kn-IN",
            "kannada": "kn-IN",
            "gu": "gu-IN",
            "gujarati": "gu-IN",
            "pa": "pa-IN",
            "punjabi": "pa-IN",
            "ml": "ml-IN",
            "malayalam": "ml-IN",
            "or": "or-IN",
            "odia": "or-IN"
        }
        
        normalized = language.lower().strip()
        
        # If already in correct format
        if normalized.endswith("-in"):
            return normalized
        
        # Map to correct format
        return language_map.get(normalized, "hi-IN")
    
    def get_language_info(self, language_code: str) -> dict:
        """
        Get information about a language
        """
        
        languages = {
            "hi-IN": {
                "code": "hi-IN",
                "iso_code": "hi",
                "name": "Hindi",
                "native_name": "हिंदी",
                "script": "Devanagari",
                "direction": "ltr"
            },
            "mr-IN": {
                "code": "mr-IN",
                "iso_code": "mr",
                "name": "Marathi",
                "native_name": "मराठी",
                "script": "Devanagari",
                "direction": "ltr"
            },
            "en-IN": {
                "code": "en-IN",
                "iso_code": "en",
                "name": "English",
                "native_name": "English",
                "script": "Latin",
                "direction": "ltr"
            },
            "bn-IN": {
                "code": "bn-IN",
                "iso_code": "bn",
                "name": "Bengali",
                "native_name": "বাংলা",
                "script": "Bengali",
                "direction": "ltr"
            },
            "ta-IN": {
                "code": "ta-IN",
                "iso_code": "ta",
                "name": "Tamil",
                "native_name": "தமிழ்",
                "script": "Tamil",
                "direction": "ltr"
            }
        }
        
        return languages.get(language_code, languages["hi-IN"])


# Global language service instance
sarvam_language = SarvamLanguage()
