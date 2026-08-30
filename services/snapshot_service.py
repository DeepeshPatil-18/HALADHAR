"""
snapshot_service.py — advisory snapshot creation and validation.

Works with the advisory_snapshots Supabase table.
Always bypasses the blackout guard (snapshots must be
readable even during a blackout for recovery purposes).
"""

import logging
from datetime import datetime
from typing import Optional

from services.blackout_service import _get_raw_supabase, compute_checksum, verify_checksum

logger = logging.getLogger(__name__)


def save_snapshot(
    advisory_id: str,
    farmer_id: str,
    content: str,
    version: int = 1,
) -> dict:
    """
    Save an advisory snapshot to advisory_snapshots.
    Uses the raw Supabase client (bypasses blackout guard)
    so snapshots are always written when possible.
    Returns the saved row or an error dict.
    """
    client = _get_raw_supabase()
    if client is None:
        return {"error": "Supabase not configured", "saved": False}

    checksum = compute_checksum(content)
    now = datetime.utcnow().isoformat() + "Z"

    try:
        result = client.table("advisory_snapshots").insert({
            "advisory_id": advisory_id,
            "farmer_id":   farmer_id,
            "content":     content,
            "version":     version,
            "checksum":    checksum,
            "created_at":  now,
        }).execute()

        row = result.data[0] if result.data else {}
        logger.info(f"[Snapshot] Saved: advisory={advisory_id} v{version} checksum={checksum[:12]}…")
        return {"saved": True, "snapshot": row, "checksum": checksum}
    except Exception as e:
        logger.error(f"[Snapshot] Save failed: {e}")
        return {"error": str(e), "saved": False}


def get_latest_snapshot(advisory_id: str) -> Optional[dict]:
    """
    Fetch the most recent snapshot for an advisory_id.
    Returns the row dict or None.
    """
    client = _get_raw_supabase()
    if client is None:
        return None

    try:
        result = (
            client.table("advisory_snapshots")
            .select("*")
            .eq("advisory_id", advisory_id)
            .order("version", desc=True)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"[Snapshot] Fetch failed for {advisory_id}: {e}")
        return None


def get_all_snapshots_for_farmer(farmer_id: str) -> list:
    """Return all snapshots for a farmer, newest first."""
    client = _get_raw_supabase()
    if client is None:
        return []

    try:
        result = (
            client.table("advisory_snapshots")
            .select("*")
            .eq("farmer_id", farmer_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        logger.error(f"[Snapshot] Farmer fetch failed: {e}")
        return []


def validate_snapshot(snapshot: dict) -> dict:
    """
    Validate a snapshot row's checksum.
    Returns: { "status": "VERIFIED"|"CORRUPTED"|"MISSING", "snapshot": ... }
    """
    status = verify_checksum(
        snapshot.get("content", ""),
        snapshot.get("checksum", ""),
    )
    return {"status": status, "snapshot": snapshot}
