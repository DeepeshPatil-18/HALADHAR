"""
blackout_service.py — central blackout state controller.

Maintains the blackout flag in memory (process-scoped).
All database writes/reads go through get_db_client() which
raises BlackoutError when the simulation is active.

This is the single source of truth for whether the database
is "available" during the demo.
"""

import hashlib
import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

# ── In-memory blackout state ─────────────────────────────────────
_blackout_active: bool = False
_blackout_started_at: Optional[str] = None
_blackout_reason: str = "Manual simulation"

# ── Supabase client (lazily initialised once) ────────────────────
_supabase_client = None


class BlackoutError(Exception):
    """Raised when a DB operation is attempted during an active blackout."""
    pass


def get_supabase():
    """
    Return the Supabase admin client.
    Raises BlackoutError if the blackout simulation is active.
    Raises RuntimeError if credentials are not configured.
    """
    if _blackout_active:
        raise BlackoutError(
            "Database unavailable — blackout simulation is active. "
            "Operation will be queued for replay."
        )
    return _get_raw_supabase()


def _get_raw_supabase():
    """
    Return the raw Supabase client regardless of blackout state.
    Used internally for health checks and recovery operations
    that must bypass the blackout guard.
    """
    global _supabase_client
    if _supabase_client is None:
        try:
            import config
            from supabase import create_client, Client
            url = config.get_supabase_url()
            key = config.get_supabase_service_role_key()
            _supabase_client = create_client(url, key)
            logger.info("[Blackout] Supabase client initialised")
        except Exception as e:
            logger.warning(f"[Blackout] Supabase not configured: {e}")
            _supabase_client = None
    return _supabase_client


# ── State management ─────────────────────────────────────────────

def activate_blackout(reason: str = "Manual simulation") -> dict:
    global _blackout_active, _blackout_started_at, _blackout_reason
    _blackout_active = True
    _blackout_started_at = datetime.utcnow().isoformat() + "Z"
    _blackout_reason = reason
    logger.warning(f"[BLACKOUT] ACTIVATED — {reason}")
    return get_blackout_status()


def deactivate_blackout() -> dict:
    global _blackout_active, _blackout_started_at
    _blackout_active = False
    _blackout_started_at = None
    logger.info("[BLACKOUT] Deactivated — normal database access restored")
    return get_blackout_status()


def is_blackout_active() -> bool:
    return _blackout_active


def get_blackout_status() -> dict:
    return {
        "active": _blackout_active,
        "started_at": _blackout_started_at,
        "reason": _blackout_reason if _blackout_active else None,
    }


# ── Real database health check ───────────────────────────────────

def check_database_health() -> dict:
    """
    Performs a real lightweight Supabase query to confirm connectivity.
    Returns structured health dict regardless of blackout state.
    """
    if _blackout_active:
        return {
            "database": "unavailable",
            "detail": "Blackout simulation active",
            "blackout": get_blackout_status(),
        }

    client = _get_raw_supabase()
    if client is None:
        return {
            "database": "not_configured",
            "detail": "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set",
            "blackout": get_blackout_status(),
        }

    try:
        # Lightweight real query — reads at most 1 row
        result = client.table("blackout_demo_records").select("id").limit(1).execute()
        return {
            "database": "healthy",
            "detail": "Connection verified",
            "blackout": get_blackout_status(),
        }
    except Exception as e:
        logger.error(f"[Blackout] Health check failed: {e}")
        return {
            "database": "error",
            "detail": str(e),
            "blackout": get_blackout_status(),
        }


# ── Checksum utility (used by snapshot & recovery services) ──────

def compute_checksum(content: str) -> str:
    """SHA-256 hex digest of a UTF-8 string."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def verify_checksum(content: str, stored_checksum: str) -> str:
    """
    Returns 'VERIFIED', 'CORRUPTED', or 'MISSING'.
    """
    if not content:
        return "MISSING"
    if not stored_checksum:
        return "MISSING"
    return "VERIFIED" if compute_checksum(content) == stored_checksum else "CORRUPTED"
