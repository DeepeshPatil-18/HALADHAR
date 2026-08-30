"""
AI Chat API Routes for KrishiMitra
Speech-first multilingual chatbot endpoints
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import base64
import logging
import re
import json as _json

from models.ai import (
    ChatRequest, ChatResponse,
    VoiceResponse,
    ConversationDetail, ConversationListResponse,
    AIStatusResponse, ServiceStatus,
    ErrorResponse
)
from services.ai.orchestrator import ai_orchestrator
from services.ai.sarvam import sarvam_stt, sarvam_tts, sarvam_language

logger = logging.getLogger(__name__)


# ============================================================================
# TTS pre-processing — strip Markdown so it is not spoken aloud
# ============================================================================

def _strip_markdown_for_tts(text: str) -> str:
    """Convert Markdown to clean spoken text for TTS.  Removes syntax without losing content."""
    # Remove heading markers (### ## #) — keep the heading text
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Remove bold/italic markers (**text** *text* __text__)
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,2}([^_]+)_{1,2}', r'\1', text)
    # Convert bullet list markers to a natural pause (blank line)
    text = re.sub(r'^\s*[-*•]\s+', '', text, flags=re.MULTILINE)
    # Convert numbered list markers
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    # Remove inline code
    text = re.sub(r'`[^`]+`', '', text)
    # Remove markdown links — keep the visible label
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # Remove horizontal rules
    text = re.sub(r'^[-*_]{3,}$', '', text, flags=re.MULTILINE)
    # Remove any leaked [INSTRUCTION:…] blocks
    text = re.sub(r'\[INSTRUCTION:.*?\]', '', text, flags=re.DOTALL)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


# ============================================================================
# Agriculture term normalization (server-side, STT transcripts)
#
# Applied to voice transcripts BEFORE sending to the AI orchestrator.
# Mirrors the client-side agriNormalize.ts rules so every voice query is
# corrected regardless of whether the frontend normalization ran.
#
# Rule order matters — more specific patterns (multi-word) come first.
# ============================================================================

_AGRI_NORM_RULES = [
    # Soybean variants (primary bug: "sonia" → "soybean")
    (re.compile(r'सोयाबीनचा\s+भाव', re.U),                           'soybean price'),
    (re.compile(r'सोयाबीन',          re.U),                           'soybean'),
    (re.compile(r'\b(sonia|sonya|sony|soya\s*beans?|soyabin|soyabean|soybin)\b', re.I), 'soybean'),
    # Onion
    (re.compile(r'(प्याज|कांदा)',    re.U),                           'onion'),
    (re.compile(r'\b(kaanda|kanda|pyaaz)\b', re.I),                   'onion'),
    # Wheat
    (re.compile(r'(गेहूं|गेहू|गहू)',  re.U),                          'wheat'),
    (re.compile(r'\b(gehu|gehun)\b', re.I),                           'wheat'),
    # Cotton
    (re.compile(r'(कापूस|कपास)',     re.U),                           'cotton'),
    (re.compile(r'\b(kapus|kapas)\b', re.I),                          'cotton'),
    # Paddy / Rice
    (re.compile(r'(धान|भात)',        re.U),                           'paddy'),
    (re.compile(r'\b(dhan|dhaan)\b', re.I),                           'paddy'),
    # Maize
    (re.compile(r'(मक्का|मकई)',      re.U),                           'maize'),
    (re.compile(r'\b(makka|makai)\b', re.I),                          'maize'),
    # Tomato
    (re.compile(r'(टोमॅटो|टमाटर)',   re.U),                          'tomato'),
    (re.compile(r'\b(tamatar|tamata)\b', re.I),                       'tomato'),
    # Chilli
    (re.compile(r'(मिर्च|मिरची)',    re.U),                           'chilli'),
    (re.compile(r'\b(mirchi|mirchee)\b', re.I),                       'chilli'),
    # Turmeric
    (re.compile(r'(हल्दी|हळद)',      re.U),                           'turmeric'),
    (re.compile(r'\bhaldi\b',        re.I),                           'turmeric'),
    # Chickpea / Gram
    (re.compile(r'(हरभरा|चना)',      re.U),                           'chickpea'),
    (re.compile(r'\b(chana|channa)\b', re.I),                         'chickpea'),
]


def _normalize_agri_terms(text: str) -> str:
    """
    Correct common speech-recognition errors for Indian crop names.
    Returns the (possibly normalised) transcript string.
    """
    original = text
    for pattern, replacement in _AGRI_NORM_RULES:
        text = pattern.sub(replacement, text)
    if text != original:
        logger.info(f"[VOICE:NORM] STT normalised: '{original}' → '{text}'")
    return text


# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/v1/ai", tags=["AI Chat"])


# ============================================================
# Text Chat Endpoint
# ============================================================

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Text chat with KrishiMitra AI.

    Flow:
      1. Receive text message + optional location context
      2. Generate AI response (Mistral Agent + tools)
      3. Convert response to speech (Sarvam TTS)
      4. Return text + audio
    """
    try:
        language_code = sarvam_language.normalize_language_code(request.language)

        result = await ai_orchestrator.generate_response(
            message=request.message,
            conversation_id=request.conversation_id,
            language=request.language,
            context=request.context
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to generate response")
            )

        response_text   = result["response_text"]
        conversation_id = result["conversation_id"]
        tts_text        = _strip_markdown_for_tts(response_text)

        audio_base64 = None
        try:
            if sarvam_tts.is_available():
                audio_bytes  = await sarvam_tts.synthesize(
                    text=tts_text, language=language_code, pace=1.0
                )
                audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        except Exception as tts_error:
            logger.error(f"TTS error: {tts_error}")

        return ChatResponse(
            success=True,
            response_text=response_text,
            audio_base64=audio_base64,
            conversation_id=conversation_id,
            language=request.language,
            provider=result.get("provider", "unknown"),
            navigation=None
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Voice Chat Endpoint
# ============================================================

@router.post("/voice", response_model=VoiceResponse)
async def voice_chat(
    audio:           UploadFile       = File(..., description="Audio file (wav, mp3, etc.)"),
    conversation_id: Optional[str]    = Form(None),
    language:        str              = Form("hi-IN"),
    location_context: Optional[str]  = Form(None),   # JSON string of location
):
    """
    Voice chat with KrishiMitra AI.

    Flow:
      1. Receive audio + optional location context (JSON string)
      2. Transcribe speech → text (Sarvam STT)
      3. Normalise agri terms in transcript
      4. Generate AI response (Mistral Agent + tools)
         — location context is forwarded so tools use real GPS/district/state
      5. Convert response → speech (Sarvam TTS)
      6. Return transcript + response text + audio
    """
    try:
        audio_bytes = await audio.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # ── Step 1: Speech → Text ──────────────────────────────────────
        if not sarvam_stt.is_available():
            raise HTTPException(status_code=503, detail="Speech-to-text service not available")

        try:
            stt_result = await sarvam_stt.transcribe(
                audio_data=audio_bytes,
                language=language
            )
            transcript = stt_result["transcript"]
            logger.info(f"[VOICE] STT transcript: '{transcript}'")

            if not transcript or transcript.strip() == "":
                raise HTTPException(
                    status_code=400,
                    detail="Could not transcribe audio. Please speak clearly and try again."
                )
        except HTTPException:
            raise
        except Exception as stt_error:
            logger.error(f"[VOICE] STT error: {stt_error}")
            raise HTTPException(status_code=500, detail=f"Speech recognition failed: {str(stt_error)}")

        # ── Step 2: Agriculture term normalisation ─────────────────────
        # Correct common STT mis-recognitions ("sonia" → "soybean" etc.)
        # The original transcript is preserved for the UI response; we only
        # send the normalised version to the AI.
        normalised_transcript = _normalize_agri_terms(transcript)

        logger.info(
            f"[VOICE] Using normalised transcript for AI: '{normalised_transcript}' "
            f"(original: '{transcript}')"
        )

        # ── Step 3: Parse location context ────────────────────────────
        parsed_location = None
        if location_context:
            try:
                parsed_location = _json.loads(location_context)
                logger.info(
                    f"[VOICE] Location context: "
                    f"city={parsed_location.get('city')}, "
                    f"district={parsed_location.get('district')}, "
                    f"state={parsed_location.get('state')}, "
                    f"lat={parsed_location.get('latitude')}, "
                    f"lon={parsed_location.get('longitude')}, "
                    f"source={parsed_location.get('source')}"
                )
            except Exception as parse_err:
                logger.warning(f"[VOICE] Failed to parse location_context: {parse_err}")

        # ── Step 4: Generate AI response ───────────────────────────────
        language_simple = language.split("-")[0]   # "hi-IN" → "hi"

        result = await ai_orchestrator.generate_response(
            message=normalised_transcript,
            conversation_id=conversation_id,
            language=language_simple,
            context=parsed_location
        )

        if not result.get("success"):
            logger.error(f"[VOICE] Mistral Agent failed: {result.get('error', 'Unknown error')}")
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to generate response")
            )

        response_text   = result["response_text"]
        conversation_id = result["conversation_id"]
        tts_text        = _strip_markdown_for_tts(response_text)

        logger.info(
            f"[VOICE] Response length: {len(response_text)} chars"
        )

        if not response_text or not response_text.strip():
            logger.error("[VOICE] Mistral Agent returned an empty response")
            raise HTTPException(
                status_code=500,
                detail="AI generated an empty response."
            )

        # ── Step 5: Text → Speech ──────────────────────────────────────
        if not sarvam_tts.is_available():
            raise HTTPException(status_code=503, detail="Text-to-speech service not available")

        try:
            logger.info(f"[VOICE] Sending to TTS (length: {len(tts_text)} chars)")
            audio_out    = await sarvam_tts.synthesize(
                text=tts_text, language=language, pace=1.0
            )
            audio_base64 = base64.b64encode(audio_out).decode('utf-8')
            logger.info(f"[VOICE] TTS success ({len(audio_base64)} base64 chars)")
        except Exception as tts_error:
            logger.error(f"[VOICE] TTS error: {tts_error}")
            raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {str(tts_error)}")

        return VoiceResponse(
            success=True,
            transcript=transcript,          # show the original transcript in the UI
            response_text=response_text,
            audio_base64=audio_base64,
            conversation_id=conversation_id,
            language=language,
            provider=result.get("provider", "unknown"),
            navigation=None
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[VOICE] Voice chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Conversation Management
# ============================================================

@router.post("/conversation/new")
async def create_conversation(language: str = "hi", user_id: Optional[str] = None):
    """Create a new conversation"""
    try:
        conversation_id = ai_orchestrator.create_conversation(
            language=language, user_id=user_id
        )
        return {"success": True, "conversation_id": conversation_id, "language": language}
    except Exception as e:
        logger.error(f"Create conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversation/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: str):
    """Get full conversation details"""
    try:
        conversation = ai_orchestrator.get_conversation(conversation_id)
        if not conversation.get("messages"):
            raise HTTPException(status_code=404, detail="Conversation not found")
        return ConversationDetail(**conversation)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation"""
    try:
        deleted = ai_orchestrator.delete_conversation(conversation_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {"success": True, "message": "Conversation deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversations", response_model=ConversationListResponse)
async def list_conversations(user_id: Optional[str] = None, limit: int = 10):
    """List recent conversations"""
    try:
        conversations = ai_orchestrator.conversation_manager.get_recent_conversations(
            user_id=user_id, limit=limit
        )
        return ConversationListResponse(conversations=conversations, total=len(conversations))
    except Exception as e:
        logger.error(f"List conversations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# System Status
# ============================================================

@router.get("/status", response_model=AIStatusResponse)
async def get_ai_status():
    """Get AI system status"""
    try:
        mistral   = ai_orchestrator.mistral
        kisan_slm = ai_orchestrator.kisan_slm

        return AIStatusResponse(
            mistral=ServiceStatus(
                name="Mistral",
                available=mistral.is_available(),
                configured=mistral.is_available(),
                message="Ready" if mistral.is_available() else "API key not configured"
            ),
            kisan_slm=ServiceStatus(
                name="Kisan SLM",
                available=kisan_slm.is_available(),
                configured=False,
                message="Not yet implemented - using Mistral"
            ),
            sarvam_stt=ServiceStatus(
                name="Sarvam STT (Saaras)",
                available=sarvam_stt.is_available(),
                configured=sarvam_stt.is_available(),
                message="Ready" if sarvam_stt.is_available() else "API key not configured"
            ),
            sarvam_tts=ServiceStatus(
                name="Sarvam TTS (Bulbul)",
                available=sarvam_tts.is_available(),
                configured=sarvam_tts.is_available(),
                message="Ready" if sarvam_tts.is_available() else "API key not configured"
            ),
            default_provider="mistral",
            supported_languages=sarvam_stt.get_supported_languages()
        )
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
