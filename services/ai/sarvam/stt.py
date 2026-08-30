"""
Sarvam Speech-to-Text (Saaras) Integration
"""

import os
import httpx
from typing import Optional


class SarvamSTT:
    """
    Sarvam Saaras - Speech-to-Text for Indian Languages
    """
    
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.api_base = "https://api.sarvam.ai"
        self.model = os.getenv("SARVAM_STT_MODEL", "saaras:v3")
        self.timeout = 30.0
        
    def is_available(self) -> bool:
        """Check if Sarvam API is configured"""
        return bool(self.api_key)
    
    async def transcribe(
        self,
        audio_data: bytes,
        language: str = "hi-IN",
        model: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio to text using Sarvam Saaras
        
        Args:
            audio_data: Audio file bytes (wav, mp3, etc.)
            language: Language code (hi-IN, mr-IN, en-IN, etc.)
            model: Sarvam STT model to use (defaults to saaras:v3)
            
        Returns:
            {
                "transcript": "transcribed text",
                "language": "detected/specified language",
                "confidence": 0.95
            }
        """
        
        if not self.is_available():
            raise ValueError("Sarvam API key not configured")
        
        # Use instance model if not provided
        if model is None:
            model = self.model
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Prepare multipart form data
                files = {
                    'file': ('audio.wav', audio_data, 'audio/wav')
                }
                
                data = {
                    'language_code': language,
                    'model': model
                }
                
                response = await client.post(
                    f"{self.api_base}/speech-to-text",
                    headers={
                        "API-Subscription-Key": self.api_key
                    },
                    files=files,
                    data=data
                )
                
                response.raise_for_status()
                result = response.json()
                
                # Extract transcript
                transcript = result.get("transcript", "")
                
                return {
                    "transcript": transcript,
                    "language": language,
                    "confidence": result.get("confidence", 1.0),
                    "raw_response": result
                }
                
        except httpx.TimeoutException:
            raise Exception("Sarvam STT request timed out")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise Exception("Invalid Sarvam API key")
            elif e.response.status_code == 429:
                raise Exception("Sarvam API rate limit exceeded")
            else:
                error_detail = e.response.text
                raise Exception(f"Sarvam STT error: {e.response.status_code} - {error_detail}")
        except Exception as e:
            raise Exception(f"Failed to transcribe audio: {str(e)}")
    
    async def transcribe_with_language_detection(
        self,
        audio_data: bytes
    ) -> dict:
        """
        Transcribe audio with automatic language detection
        
        This will be implemented when Sarvam adds language detection support.
        For now, defaults to Hindi.
        """
        # Default to Hindi for now
        return await self.transcribe(audio_data, language="hi-IN")
    
    def get_supported_languages(self) -> list:
        """
        Get list of supported languages for STT
        
        Sarvam Saaras supports major Indian languages
        """
        return [
            {"code": "hi-IN", "name": "Hindi", "native": "हिंदी"},
            {"code": "mr-IN", "name": "Marathi", "native": "मराठी"},
            {"code": "en-IN", "name": "English (India)", "native": "English"},
            {"code": "bn-IN", "name": "Bengali", "native": "বাংলা"},
            {"code": "ta-IN", "name": "Tamil", "native": "தமிழ்"},
            {"code": "te-IN", "name": "Telugu", "native": "తెలుగు"},
            {"code": "kn-IN", "name": "Kannada", "native": "ಕನ್ನಡ"},
            {"code": "gu-IN", "name": "Gujarati", "native": "ગુજરાતી"},
            {"code": "pa-IN", "name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
            {"code": "ml-IN", "name": "Malayalam", "native": "മലയാളം"},
            {"code": "or-IN", "name": "Odia", "native": "ଓଡ଼ିଆ"}
        ]


# Global STT instance
sarvam_stt = SarvamSTT()
