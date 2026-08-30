"""
Pydantic Models for AI Services
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============================================
# Navigation Action Model
# ============================================

class NavigationAction(BaseModel):
    """Navigation action for frontend"""
    enabled: bool = Field(True, description="Whether navigation is enabled")
    label: str = Field(..., description="Button label (Hindi/Marathi)")
    label_english: Optional[str] = Field(None, description="Button label (English)")
    route: str = Field(..., description="Frontend route path")
    params: Dict[str, str] = Field(default_factory=dict, description="Query parameters")


# ============================================
# Chat Models
# ============================================

class ChatRequest(BaseModel):
    """Request for text chat"""
    message: str = Field(..., description="User's text message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID (creates new if not provided)")
    language: str = Field("hi", description="Language code (hi, mr, en)")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class ChatResponse(BaseModel):
    """Response from text chat"""
    success: bool
    response_text: str
    audio_base64: Optional[str] = Field(None, description="Base64 encoded audio of response")
    conversation_id: str
    language: str
    provider: str
    navigation: Optional[NavigationAction] = Field(None, description="Optional navigation action")
    error: Optional[str] = None


# ============================================
# Voice Models
# ============================================

class VoiceRequest(BaseModel):
    """Request for voice chat (multipart form data in actual API)"""
    conversation_id: Optional[str] = Field(None, description="Conversation ID")
    language: str = Field("hi-IN", description="Language code (hi-IN, mr-IN, en-IN)")


class VoiceResponse(BaseModel):
    """Response from voice chat"""
    success: bool
    transcript: str = Field("", description="Transcribed user speech")
    response_text: str = Field("", description="AI response text")
    audio_base64: str = Field("", description="Base64 encoded audio of AI response")
    conversation_id: str
    language: str
    provider: str
    navigation: Optional[NavigationAction] = Field(None, description="Optional navigation action")
    error: Optional[str] = None


# ============================================
# Conversation Models
# ============================================

class Message(BaseModel):
    """Single message in conversation"""
    role: str = Field(..., description="user or assistant")
    content: str = Field(..., description="Message content")
    timestamp: str
    type: str = Field("text", description="text or voice")


class ConversationMetadata(BaseModel):
    """Conversation metadata"""
    created_at: str
    last_updated: Optional[str] = None
    language: str
    user_id: Optional[str] = None
    message_count: int


class ConversationDetail(BaseModel):
    """Full conversation details"""
    conversation_id: str
    messages: List[Message]
    metadata: ConversationMetadata


class ConversationSummary(BaseModel):
    """Conversation summary for listing"""
    conversation_id: str
    created_at: str
    last_updated: Optional[str]
    language: str
    message_count: int
    preview: Optional[str] = Field(None, description="First message preview")


class ConversationListResponse(BaseModel):
    """List of conversations"""
    conversations: List[ConversationSummary]
    total: int


# ============================================
# Error Models
# ============================================

class ErrorResponse(BaseModel):
    """Error response"""
    success: bool = False
    error: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


# ============================================
# Service Status Models
# ============================================

class ServiceStatus(BaseModel):
    """Status of an AI service"""
    name: str
    available: bool
    configured: bool
    message: Optional[str] = None


class AIStatusResponse(BaseModel):
    """Overall AI system status"""
    mistral: ServiceStatus
    kisan_slm: ServiceStatus
    sarvam_stt: ServiceStatus
    sarvam_tts: ServiceStatus
    default_provider: str
    supported_languages: List[Dict[str, str]]
