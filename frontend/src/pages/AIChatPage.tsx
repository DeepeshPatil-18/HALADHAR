/**
 * AIChatPage — HALADHAR Assistant
 *
 * Two clearly separated modes:
 *   TEXT  (💬) — type a question, get a text response
 *   VOICE (🎤) — speak a question, hear the answer
 *
 * Mode is set by:
 *   • navigation state  { mode: 'text' | 'voice' }
 *   • initialQuery from home suggestions always opens TEXT mode
 *   • default: TEXT (chat)
 *
 * All existing Sarvam STT/TTS and AI chat API calls are preserved unchanged.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, Mic, Square, Volume2, MessageSquare, AlertCircle, Shield } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation as useUserLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { useBlackout } from '../contexts/BlackoutContext';
import { MarkdownMessage } from '../components/MarkdownMessage';
import { RecoveryStatus } from '../components/RecoveryStatus';
import { normalizeAgriTerms } from '../utils/agriNormalize';
import { checksumAsync } from '../lib/integrity';
import { idbPut } from '../lib/indexedDb';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { DataStatus } from '../types/recovery';
import '../styles/haladhar-design.css';

type Mode       = 'text' | 'voice';
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface NavigationAction {
  enabled: boolean;
  label: string;
  label_english?: string;
  route: string;
  params?: Record<string, string>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type: 'text' | 'voice';
  audioUrl?: string;
  navigation?: NavigationAction;
  saveStatus?: DataStatus;       // VERIFIED | PENDING | RECOVERED | UNAVAILABLE
  operationId?: string;          // idempotency key — never regenerated on retry
}

const API_BASE = () => import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function AIChatPage() {
  const navigate    = useNavigate();
  const routeState  = useLocation().state as { mode?: Mode; initialQuery?: string } | null;
  const { ht }      = useHaladharTranslation();

  /* ── Language + Location from app-wide contexts ────────────── */
  const appLanguage = useLanguage();              // 'mr' | 'hi' | 'en'
  const userLoc     = useUserLocation();

  // Map app language to API language codes
  const textLang  = appLanguage;                  // hi, mr, en
  const voiceLang = appLanguage === 'mr' ? 'mr-IN'
                  : appLanguage === 'en' ? 'en-IN'
                  : 'hi-IN';

  /** Build location context object to attach to every AI request */
  const buildLocationContext = () => {
    const loc = userLoc.location;
    if (!loc) return undefined;
    return {
      latitude:  loc.latitude  !== 0 ? loc.latitude  : undefined,
      longitude: loc.longitude !== 0 ? loc.longitude : undefined,
      city:      loc.city,
      district:  loc.district,
      state:     loc.state,
      country:   loc.country,
      source:    loc.source,
    };
  };

  /* ── Auth (for farmer ID in advisory saves) ────────────────── */
  const { user, isGuest, guestUserId } = useAuth();
  const farmerId = user?.id ?? guestUserId ?? 'anonymous';

  /* ── Blackout context ───────────────────────────────────────── */
  const { blackoutMode, addPendingOp, nextDisplayId, activateBlackout, deactivateBlackout } = useBlackout();

  /* ── Blackout save status message (shown inline in chat) ─────── */
  const [blackoutSaveMsg, setBlackoutSaveMsg] = useState<string | null>(null);

  /**
   * Save an assistant advisory.
   *
   * Normal mode  → Supabase advisory_events + snapshot
   * Blackout     → AUTOMATICALLY write to blackout_demo_records (Supabase)
   *                + IDB pending queue (for later replay into main DB)
   *
   * The farmer never needs a second action. The emergency record
   * is created immediately and automatically.
   */
  const saveAdvisory = useCallback(async (
    operationId: string,
    advisoryId: string,
    content: string,
    question: string,
    farmerDisplayName?: string,
  ): Promise<DataStatus> => {
    const checksum = await checksumAsync(content);
    const now      = new Date().toISOString();

    // Always save to IDB first — works even without Supabase
    await idbPut('advisories', {
      id: advisoryId, operationId, farmerId, content, checksum, timestamp: now, question,
    });

    // ── BLACKOUT PATH — redirect to blackout_demo_records ─────────
    if (blackoutMode) {
      const displayId = nextDisplayId();

      // Try to write to blackout_demo_records if Supabase is configured
      if (isSupabaseConfigured) {
        try {
          await supabase.from('blackout_demo_records').insert({
            id:          advisoryId,
            farmer_name: farmerDisplayName || farmerId.slice(0, 8),
            crop:        question.slice(0, 80),
            advisory:    content.slice(0, 500),
            status:      'PENDING',
            version:     1,
            checksum,
            updated_at:  now,
          });
          console.info('[Blackout] Saved to blackout_demo_records:', displayId);
        } catch (err) {
          console.warn('[Blackout] blackout_demo_records write failed, IDB only:', err);
        }
      } else {
        // No Supabase — demo works entirely from IDB
        console.info('[Blackout] Demo mode (no Supabase) — data in IDB:', displayId);
      }

      // Always queue in IDB for replay when DB becomes available
      await addPendingOp({
        id: operationId, displayId, farmerId, advisoryId,
        content, question, language: textLang, checksum,
        createdAt: now, status: 'pending',
      });

      return 'PENDING';
    }

    // ── NORMAL PATH ───────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      // No Supabase configured — store locally, show as VERIFIED for demo
      console.info('[Advisory] Supabase not configured — stored locally only');
      return 'VERIFIED';
    }

    try {
      const { error } = await supabase.from('advisory_events').insert({
        operation_id: operationId,
        advisory_id:  advisoryId,
        farmer_id:    farmerId,
        event_type:   'CREATED',
        payload:      { content, question, language: textLang, checksum },
        created_at:   now,
      });
      if (error) throw error;

      // Snapshot — non-critical
      supabase.from('advisory_snapshots').insert({
        advisory_id: advisoryId, farmer_id: farmerId,
        content, version: 1, checksum, created_at: now,
      }).then(() => {}).catch(() => {});

      return 'VERIFIED';
    } catch (err) {
      console.warn('[Advisory] Supabase write failed — falling back to IDB only:', err);
      const displayId = nextDisplayId();
      await addPendingOp({
        id: operationId, displayId, farmerId, advisoryId,
        content, question, language: textLang, checksum,
        createdAt: now, status: 'pending',
      });
      return 'PENDING';
    }
  }, [farmerId, blackoutMode, textLang, addPendingOp, nextDisplayId]);

  /* ── Determine initial mode from navigation state ──────────── */  const initMode: Mode = routeState?.initialQuery
    ? 'text'                          // suggestion tap → text
    : (routeState?.mode ?? 'text');   // explicit mode or default text

  const [mode, setMode] = useState<Mode>(initMode);

  /* ── Shared conversation state ─────────────────────────────── */
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error,          setError]          = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── TEXT mode state ────────────────────────────────────────── */
  const [textInput, setTextInput] = useState(routeState?.initialQuery ?? '');
  const [sending,   setSending]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── VOICE mode state ───────────────────────────────────────── */
  const [voiceState,  setVoiceState]  = useState<VoiceState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);

  /* ── Audio playback ─────────────────────────────────────────── */
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ── Focus input on text mode ───────────────────────────────── */
  useEffect(() => {
    if (mode === 'text') inputRef.current?.focus();
  }, [mode]);

  /* ── Auto-scroll to latest message ─────────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── Cleanup on unmount ─────────────────────────────────────── */
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (isRecording) {
        try {
          mediaRecorderRef.current?.stop();
          mediaRecorderRef.current?.stream?.getTracks().forEach(t => t.stop());
        } catch {}
      }
    };
  }, [isRecording]);

  /* ══════════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════════ */

  const base64ToBlob = (b64: string, mime: string): Blob => {
    const bytes = atob(b64);
    const arr   = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const playAudio = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      audioRef.current?.pause();
      audioRef.current = null;
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlayingAudio(true);
      audio.onended = () => { setIsPlayingAudio(false); audioRef.current = null; resolve(); };
      audio.onerror = () => { setIsPlayingAudio(false); audioRef.current = null; reject(); };
      audio.play().catch(reject);
    });
  }, []);

  /* ══════════════════════════════════════════════════════════════
     TEXT MODE — send message
  ══════════════════════════════════════════════════════════════ */

  const sendText = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const rawText = textInput.trim();
    if (!rawText || sending) return;

    setError(null);
    setSending(true);
    setTextInput('');

    // Normalize agriculture terms (e.g., "sonia" → "soybean")
    const { text } = normalizeAgriTerms(rawText);

    const userMsg: Message = {
      role: 'user', content: rawText,   // show the original user text in chat
      timestamp: new Date().toISOString(), type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);

    console.debug('[Assistant Request]', {
      query: text,
      language: textLang,
      'location attached': !!buildLocationContext(),
    });

    try {
      const res = await fetch(`${API_BASE()}/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          language: textLang,
          context: buildLocationContext(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.detail || data.error || 'Chat failed');

      if (data.conversation_id) setConversationId(data.conversation_id);

      let audioUrl: string | undefined;
      if (data.audio_base64) {
        audioUrl = URL.createObjectURL(base64ToBlob(data.audio_base64, 'audio/wav'));
      }

      const assistantMsg: Message = {
        role: 'assistant', content: data.response_text,
        timestamp: new Date().toISOString(), type: 'text',
        audioUrl, navigation: data.navigation,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // ── Blackout-resilient save ────────────────────────────
      const opId  = crypto.randomUUID();
      const advId = data.conversation_id ?? opId;
      const farmerName = user?.user_metadata?.full_name
        || localStorage.getItem('userLocation')
        || farmerId.slice(0, 8);

      if (blackoutMode) {
        setBlackoutSaveMsg('⏳ Securing your data...');
      }

      const saveStatus = await saveAdvisory(opId, advId, data.response_text, text, farmerName);

      if (blackoutMode && saveStatus === 'PENDING') {
        setBlackoutSaveMsg('✓ Data secured in Blackout Demo Records');
        setTimeout(() => setBlackoutSaveMsg(null), 4000);
      }

      // Update last assistant message with save status
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant') {
          updated[updated.length - 1] = { ...last, saveStatus, operationId: opId };
        }
        return updated;
      });
    } catch (err: any) {
      setError(err.message || 'जवाब देने में समस्या है। दोबारा कोशिश करें।');
    } finally {
      setSending(false);
    }
  };

  /* ══════════════════════════════════════════════════════════════
     VOICE MODE — recording
  ══════════════════════════════════════════════════════════════ */

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current  = recorder;
      audioChunksRef.current    = [];

      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (audioChunksRef.current.length > 0) {
          await sendVoice(new Blob(audioChunksRef.current, { type: 'audio/wav' }));
        }
      };

      recorder.start();
      setIsRecording(true);
      setVoiceState('listening');
    } catch {
      setError(ht('ask.micPermissionDenied'));
      setVoiceState('idle');
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setVoiceState('processing');
  };

  const sendVoice = async (blob: Blob) => {
    setVoiceState('processing');
    const form = new FormData();
    form.append('audio', blob, 'recording.wav');
    if (conversationId) form.append('conversation_id', conversationId);
    form.append('language', voiceLang);
    // Attach location context for voice too
    const locCtx = buildLocationContext();
    if (locCtx) form.append('location_context', JSON.stringify(locCtx));

    console.debug('[Assistant Request]', {
      language: voiceLang,
      'location attached': !!locCtx,
      city: locCtx?.city,
      district: locCtx?.district,
      state: locCtx?.state,
    });

    try {
      const res  = await fetch(`${API_BASE()}/v1/ai/voice`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.detail || data.error || 'Voice failed');

      if (data.conversation_id) setConversationId(data.conversation_id);

      // Show original transcript in the UI; the backend has already normalised
      // agri terms before sending to the AI (server-side agriNormalize).
      // We also run client-side normalisation as a best-effort safeguard.
      const rawTranscript  = data.transcript as string;
      const { text: normTranscript, changed, corrections } = normalizeAgriTerms(rawTranscript);
      if (changed) {
        console.debug('[Voice:Norm]', rawTranscript, '→', normTranscript, '(', corrections, ')');
      }

      const audioUrl = URL.createObjectURL(base64ToBlob(data.audio_base64, 'audio/wav'));

      setMessages(prev => [...prev,
        {
          role: 'user',
          // Show the original transcript so the user sees what was heard
          content: rawTranscript,
          timestamp: new Date().toISOString(),
          type: 'voice',
        },
        {
          role: 'assistant',
          content: data.response_text,
          timestamp: new Date().toISOString(),
          type: 'voice',
          audioUrl,
          navigation: data.navigation,
        },
      ]);

      setVoiceState('speaking');
      await playAudio(audioUrl);
      setVoiceState('idle');
    } catch (err: any) {
      setError(err.message || ht('ask.voiceError'));
      setVoiceState('idle');
    }
  };

  /* ══════════════════════════════════════════════════════════════
     VOICE STATE LABEL
  ══════════════════════════════════════════════════════════════ */

  const voiceLabel = () => {
    if (voiceState === 'listening')  return ht('haladhar.voice.listening');
    if (voiceState === 'processing') return ht('haladhar.voice.thinking');
    if (voiceState === 'speaking')   return ht('haladhar.voice.thinking');
    return ht('haladhar.voice.tapToSpeak');
  };

  /* ══════════════════════════════════════════════════════════════
     SHARED: MODE SWITCHER + HEADER
  ══════════════════════════════════════════════════════════════ */

  const header = (
    <div className="ai-header">
      <button
        onClick={() => navigate('/')}
        className="ai-back"
        aria-label="Back"
      >
        <ChevronLeft size={22} strokeWidth={2} />
      </button>

      {/* Mode toggle — two clean tabs */}
      <div className="ai-mode-toggle">
        <button
          className={`ai-mode-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          <MessageSquare size={14} strokeWidth={2} />
          {ht('haladhar.assist.chatLabel')}
        </button>
        <button
          className={`ai-mode-tab ${mode === 'voice' ? 'active' : ''}`}
          onClick={() => setMode('voice')}
        >
          <Mic size={14} strokeWidth={2} />
          {ht('haladhar.assist.voiceLabel')}
        </button>
      </div>

      {/* Blackout toggle — action only, NO navigation */}
      <button
        onClick={() => blackoutMode ? deactivateBlackout() : activateBlackout()}
        title={blackoutMode ? 'Restore Database' : 'Simulate Database Failure'}
        style={{
          background: blackoutMode ? '#c0392b' : 'none',
          border: blackoutMode ? 'none' : '1px solid #dde8cc',
          borderRadius: 6,
          cursor: 'pointer',
          padding: '4px 8px',
          marginLeft: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          fontWeight: 700,
          color: blackoutMode ? '#fff' : 'var(--haladhar-text-muted)',
        }}
        aria-label={blackoutMode ? 'Restore Database' : 'Simulate Database Failure'}
      >
        <Shield size={13} strokeWidth={2} />
        {blackoutMode ? '🔴' : '🛡'}
      </button>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER — VOICE MODE
  ══════════════════════════════════════════════════════════════ */

  if (mode === 'voice') {
    return (
      <div className="haladhar-container">
        {header}

        {/* Blackout banner — voice mode */}
        {blackoutMode && (
          <div style={{ background: '#c0392b', color: '#fff', padding: '8px 16px', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            🔴 Database failure detected. Switching to recovery storage...
            {blackoutSaveMsg && <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2 }}>{blackoutSaveMsg}</div>}
          </div>
        )}

        <div className="ai-voice-body">
          {/* Brand */}
          <p className="ai-voice-brand">{ht('haladhar.brand')}</p>

          {/* Large mic button */}
          <div className="ai-mic-wrap">
            {!isRecording ? (
              <button
                className={`ai-mic ${voiceState !== 'idle' ? 'disabled' : ''}`}
                onClick={startRecording}
                disabled={voiceState !== 'idle'}
                aria-label="Start recording"
              >
                <Mic size={44} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                className="ai-mic recording"
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <Square size={34} strokeWidth={2} fill="white" />
              </button>
            )}
          </div>

          {/* State text */}
          <p className="ai-voice-status">{voiceLabel()}</p>

          {/* Spinner while processing */}
          {(voiceState === 'processing' || voiceState === 'speaking') && (
            <div className="haladhar-spinner" style={{ margin: '0 auto 16px' }} />
          )}

          {/* Latest exchange */}
          {messages.length > 0 && (voiceState === 'processing' || voiceState === 'speaking' || voiceState === 'idle') && (
            <div className="ai-voice-transcript">
              {messages.filter(m => m.role === 'user').slice(-1).map((m, i) => (
                <div key={i} className="ai-vt-you">
                  <span className="ai-vt-label">{ht('haladhar.assist.you')}</span>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--haladhar-text-primary)', margin: 0 }}>{m.content}</p>
                </div>
              ))}
              {messages.filter(m => m.role === 'assistant').slice(-1).map((m, i) => (
                <div key={i} className="ai-vt-answer">
                  <span className="ai-vt-label">{ht('haladhar.brand')}</span>
                  <MarkdownMessage content={m.content} />
                  {m.audioUrl && (
                    <button
                      className="ai-play-btn"
                      onClick={() => playAudio(m.audioUrl!)}
                      disabled={isPlayingAudio}
                    >
                      <Volume2 size={16} />
                      {ht('haladhar.water.listen')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="ai-error">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER — TEXT / CHAT MODE
  ══════════════════════════════════════════════════════════════ */

  return (
    <div className="haladhar-container">
      {header}

      {/* ── Blackout banner — inline, no navigation ────────────── */}
      {blackoutMode && (
        <div style={{
          background: '#c0392b', color: '#fff',
          padding: '8px 16px', fontSize: 13, fontWeight: 600,
          display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0,
        }}>
          <span>🔴 Database failure detected. Switching to recovery storage...</span>
          {blackoutSaveMsg && (
            <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.92 }}>
              {blackoutSaveMsg}
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="ai-messages">
        {messages.length === 0 ? (
          <div className="ai-empty">
            <p className="haladhar-subheading">{ht('haladhar.assist.chatLabel')}</p>
            <p className="haladhar-body" style={{ marginTop: 6 }}>{ht('haladhar.home.askPlaceholder')}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`ai-bubble-row ${msg.role}`}>
                <div className={`ai-bubble ${msg.role}`}>
                  {msg.role === 'user'
                    ? <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.6 }}>{msg.content}</p>
                    : <MarkdownMessage content={msg.content} />
                  }
                  {msg.role === 'assistant' && msg.audioUrl && (
                    <button
                      className="ai-play-btn"
                      onClick={() => playAudio(msg.audioUrl!)}
                      disabled={isPlayingAudio}
                    >
                      <Volume2 size={15} />
                      {ht('haladhar.water.listen')}
                    </button>
                  )}
                  {msg.role === 'assistant' && msg.navigation?.enabled && (
                    <button
                      className="ai-nav-btn"
                      onClick={() => {
                        const { route, params } = msg.navigation!;
                        const full = params && Object.keys(params).length
                          ? `${route}?${new URLSearchParams(params)}`
                          : route;
                        navigate(full);
                      }}
                    >
                      {msg.navigation.label}
                    </button>
                  )}
                  {/* Recovery status badge — only shown when not VERIFIED */}
                  {msg.role === 'assistant' && msg.saveStatus && msg.saveStatus !== 'VERIFIED' && (
                    <div style={{ marginTop: 6 }}>
                      <RecoveryStatus status={msg.saveStatus} compact language={appLanguage} />
                    </div>
                  )}
                  <span className="ai-time">
                    {new Date(msg.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {sending && (
              <div className="ai-bubble-row assistant">
                <div className="ai-bubble assistant ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="ai-error" style={{ margin: '0 16px 8px' }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Input bar */}
      <form className="ai-input-bar" onSubmit={sendText}>
        <input
          ref={inputRef}
          type="text"
          className="ai-input"
          placeholder={ht('haladhar.assist.chatPlaceholder')}
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          disabled={sending}
          autoComplete="off"
        />
        <button
          type="submit"
          className="ai-send"
          disabled={!textInput.trim() || sending}
          aria-label="Send"
        >
          <Send size={18} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
