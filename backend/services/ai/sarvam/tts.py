"""
Sarvam Text-to-Speech (Bulbul) Integration
"""

import os
import httpx
from typing import Optional


class SarvamTTS:
    """
    Sarvam Bulbul - Text-to-Speech for Indian Languages
    """
    
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.api_base = "https://api.sarvam.ai"
        self.model = os.getenv("SARVAM_TTS_MODEL", "bulbul:v3")
        self.speaker = os.getenv("SARVAM_TTS_SPEAKER", "shubh")  # Official default for bulbul:v3
        self.timeout = 30.0
        
    def is_available(self) -> bool:
        """Check if Sarvam API is configured"""
        return bool(self.api_key)
    
    async def synthesize(
        self,
        text: str,
        language: str = "hi-IN",
        speaker: Optional[str] = None,
        pace: float = 1.0,
        model: Optional[str] = None
    ) -> bytes:
        """
        Convert text to speech using Sarvam Bulbul
        
        Args:
            text: Text to convert to speech
            language: Language code (hi-IN, mr-IN, en-IN, etc.)
            speaker: Voice speaker (uses configured default if not provided)
            pace: Speaking pace (0.5 to 2.0) - supported in bulbul:v3
            model: Sarvam TTS model to use (defaults to bulbul:v3)
            
        Returns:
            Audio bytes (WAV format)
            
        Note:
            For bulbul:v3, pitch and loudness are NOT supported and must not be sent.
        """
        
        if not self.is_available():
            raise ValueError("Sarvam API key not configured")
        
        # Use instance defaults if not provided
        if model is None:
            model = self.model
        if speaker is None:
            speaker = self.speaker
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Build payload for Bulbul V3 per official Sarvam API documentation
                # Reference: https://docs.sarvam.ai/api-reference-docs/text-to-speech/convert
                payload = {
                    "text": text,                      # Changed from "inputs" array to single "text"
                    "language_code": language,         # Correct parameter name per docs
                    "speaker": speaker,                # bulbul:v3 compatible speaker
                    "pace": pace,                      # Supported: 0.5-2.0
                    "speech_sample_rate": 24000,       # Default for bulbul:v3
                    "model": model                     # bulbul:v3
                }
                # NOT included (not supported in bulbul:v3):
                # - pitch (not supported)
                # - loudness (not supported)
                # - enable_preprocessing (automatically enabled in v3)
                
                response = await client.post(
                    f"{self.api_base}/text-to-speech",
                    headers={
                        "API-Subscription-Key": self.api_key,
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                
                response.raise_for_status()
                
                # Sarvam returns JSON with base64 encoded audio
                result = response.json()
                
                # Get audio data
                if "audios" in result and len(result["audios"]) > 0:
                    import base64
                    audio_base64 = result["audios"][0]
                    audio_bytes = base64.b64decode(audio_base64)
                    return audio_bytes
                else:
                    raise Exception("No audio data in Sarvam TTS response")
                
        except httpx.TimeoutException:
            raise Exception("Sarvam TTS request timed out")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise Exception("Invalid Sarvam API key")
            elif e.response.status_code == 429:
                raise Exception("Sarvam API rate limit exceeded")
            else:
                error_detail = e.response.text
                raise Exception(f"Sarvam TTS error: {e.response.status_code} - {error_detail}")
        except Exception as e:
            raise Exception(f"Failed to synthesize speech: {str(e)}")
    
    def get_speakers_for_language(self, language: str) -> list:
        """
        Get available voice speakers for a language
        
        Sarvam Bulbul V3 provides natural Indian voices
        Based on actual Sarvam API documentation for bulbul:v3
        """
        # Bulbul V3 speakers (from API error message)
        all_speakers = [
            "aditya", "ritu", "ashutosh", "priya", "neha", "rahul", "pooja", 
            "rohan", "simran", "kavya", "amit", "dev", "ishita", "shreya", 
            "ratan", "varun", "manan", "sumit", "roopa", "kabir", "aayan", 
            "shubh", "advait", "anand", "tanya", "tarun", "sunny", "mani", 
            "gokul", "vijay", "shruti", "suhani", "mohit", "kavitha", "rehan", 
            "soham", "rupali", "niharika", "meera", "arvind"
        ]
        
        # Recommended speakers by language (subset of all_speakers)
        speakers = {
            "hi-IN": [
                {"id": "meera", "name": "Meera", "gender": "female", "description": "Natural Hindi female voice"},
                {"id": "priya", "name": "Priya", "gender": "female", "description": "Natural Hindi female voice"},
                {"id": "neha", "name": "Neha", "gender": "female", "description": "Natural Hindi female voice"},
                {"id": "rahul", "name": "Rahul", "gender": "male", "description": "Natural Hindi male voice"},
                {"id": "amit", "name": "Amit", "gender": "male", "description": "Natural Hindi male voice"}
            ],
            "mr-IN": [
                {"id": "kavya", "name": "Kavya", "gender": "female", "description": "Natural Marathi female voice"},
                {"id": "shreya", "name": "Shreya", "gender": "female", "description": "Natural Marathi female voice"},
                {"id": "rohan", "name": "Rohan", "gender": "male", "description": "Natural Marathi male voice"},
                {"id": "manan", "name": "Manan", "gender": "male", "description": "Natural Marathi male voice"}
            ],
            "en-IN": [
                {"id": "priya", "name": "Priya", "gender": "female", "description": "Natural Indian English female voice"},
                {"id": "simran", "name": "Simran", "gender": "female", "description": "Natural Indian English female voice"},
                {"id": "dev", "name": "Dev", "gender": "male", "description": "Natural Indian English male voice"},
                {"id": "rohan", "name": "Rohan", "gender": "male", "description": "Natural Indian English male voice"}
            ]
        }
        
        return speakers.get(language, speakers["hi-IN"])
    
    def get_supported_languages(self) -> list:
        """
        Get list of supported languages for TTS
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


# Global TTS instance
sarvam_tts = SarvamTTS()
