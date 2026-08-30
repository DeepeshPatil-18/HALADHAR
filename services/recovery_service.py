"""
recovery_service.py — pending operations, recovery log, idempotent replay.

Handles:
  - Queuing operations that failed due to blackout
  - Idempotent replay when database is restored
  - Recording recovery events to recovery_log
  - Recovering demo records from snapshots
"""

import logging
from datetime import datetime
from typing import Optional

from services.blackout_service import _get_raw_supabase, compute_checksum, verify_checksum
from services.snapshot_service import get_latest_snapshot, validate_snapshot, save_snapshot

logger = logging.getLogger(__name__)


# ── Pending Operations ───────────────────────────────────────────

def queue_pending_operation(
    operation_id: str,
    operation_type: str,
    payload: dict,
) -> dict:
    """
    Write a pending operation to pending_operations table.
    Uses raw client — must succeed even during blackout.
    Returns the saved row or error.
    """
    client = _get_raw_supabase()
    if client is None:
        return {"error": "Supabase not configured", "queued": False}

    now = datetime.utcnow().isoformat() + "Z"
    try:
        # Upsert by operation_id — safe to call multiple times
        result = client.table("pending_operations").upsert({
            "operation_id":   operation_id,
            "operation_type": operation_type,
            "payload":        payload,
            "created_at":     now,
            "retry_count":    0,
            "status":         "pending",
        }, on_conflict="operation_id").execute()

        log_recovery_event(
            event_type="OPERATION_QUEUED",
            records_affected=1,
            records_recovered=0,
            records_unrecoverable=0,
            details={"operation_id": operation_id, "type": operation_type},
        )

        logger.info(f"[Recovery] Queued operation {operation_id} ({operation_type})")
        return {"queued": True, "operation_id": operation_id}
    except Exception as e:
        logger.error(f"[Recovery] Queue failed: {e}")
        return {"error": str(e), "queued": False}


def get_pending_operations(status: str = "pending") -> list:
    """Return all pending operations with the given status."""
    client = _get_raw_supabase()
    if client is None:
        return []
    try:
        result = (
            client.table("pending_operations")
            .select("*")
            .eq("status", status)
            .order("created_at", desc=False)
            .execute()
        )
        return result.data or []
    except Exception as e:
        logger.error(f"[Recovery] Get pending failed: {e}")
        return []


def get_pending_count() -> int:
    """Fast count of pending operations."""
    return len(get_pending_operations("pending"))


def mark_operation_completed(operation_id: str) -> bool:
    client = _get_raw_supabase()
    if client is None:
        return False
    try:
        client.table("pending_operations").update(
            {"status": "completed"}
        ).eq("operation_id", operation_id).execute()
        return True
    except Exception as e:
        logger.error(f"[Recovery] Mark completed failed: {e}")
        return False


def mark_operation_failed(operation_id: str) -> bool:
    client = _get_raw_supabase()
    if client is None:
        return False
    try:
        client.table("pending_operations").update(
            {"status": "failed"}
        ).eq("operation_id", operation_id).execute()
        return True
    except Exception as e:
        logger.error(f"[Recovery] Mark failed error: {e}")
        return False


# ── Recovery Log ─────────────────────────────────────────────────

def log_recovery_event(
    event_type: str,
    records_affected: int = 0,
    records_recovered: int = 0,
    records_unrecoverable: int = 0,
    details: Optional[dict] = None,
) -> None:
    """Append an entry to recovery_log. Non-blocking — errors are logged only."""
    client = _get_raw_supabase()
    if client is None:
        return
    try:
        client.table("recovery_log").insert({
            "event_type":            event_type,
            "records_affected":      records_affected,
            "records_recovered":     records_recovered,
            "records_unrecoverable": records_unrecoverable,
            "details":               details or {},
            "created_at":            datetime.utcnow().isoformat() + "Z",
        }).execute()
        logger.info(f"[Recovery] Event logged: {event_type}")
    except Exception as e:
        logger.error(f"[Recovery] Log event failed: {e}")


def get_recent_recovery_log(limit: int = 20) -> list:
    client = _get_raw_supabase()
    if client is None:
        return []
    try:
        result = (
            client.table("recovery_log")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return list(reversed(result.data or []))
    except Exception as e:
        logger.error(f"[Recovery] Get log failed: {e}")
        return []


# ── Idempotent Replay ────────────────────────────────────────────

def replay_pending_operations() -> dict:
    """
    Process all pending operations now that the database is available.
    Idempotent: checks advisory_events before inserting.

    Returns: { replayed, succeeded, failed, skipped }
    """
    from services.blackout_service import get_supabase   # will raise if still blacked out

    pending = get_pending_operations("pending")
    succeeded = 0
    failed    = 0
    skipped   = 0

    log_recovery_event(
        "RECOVERY_STARTED",
        records_affected=len(pending),
        details={"pending_count": len(pending)},
    )

    for op in pending:
        operation_id   = op["operation_id"]
        operation_type = op["operation_type"]
        payload        = op.get("payload", {})

        try:
            client = get_supabase()   # raises BlackoutError if still down

            if operation_type == "SAVE_ADVISORY":
                # ── Idempotency check ────────────────────────────
                existing = (
                    client.table("advisory_events")
                    .select("id")
                    .eq("operation_id", operation_id)
                    .execute()
                )
                if existing.data:
                    logger.info(f"[Recovery] {operation_id} already exists — skip")
                    mark_operation_completed(operation_id)
                    skipped += 1
                    continue

                # ── Write advisory event ─────────────────────────
                advisory_id = payload.get("advisory_id", operation_id)
                farmer_id   = payload.get("farmer_id", "anonymous")
                content     = payload.get("content", "")
                checksum    = payload.get("checksum") or compute_checksum(content)

                client.table("advisory_events").insert({
                    "operation_id": operation_id,
                    "advisory_id":  advisory_id,
                    "farmer_id":    farmer_id,
                    "event_type":   "CREATED",
                    "payload":      {
                        "content":  content,
                        "question": payload.get("question", ""),
                        "language": payload.get("language", "mr"),
                        "checksum": checksum,
                    },
                    "created_at":   payload.get("created_at", datetime.utcnow().isoformat() + "Z"),
                }).execute()

                # ── Write snapshot ───────────────────────────────
                save_snapshot(
                    advisory_id=advisory_id,
                    farmer_id=farmer_id,
                    content=content,
                    version=1,
                )

                # ── Update demo record ───────────────────────────
                client.table("blackout_demo_records").upsert({
                    "id":           advisory_id,
                    "farmer_name":  farmer_id,
                    "crop":         payload.get("question", "")[:80],
                    "advisory":     content[:500],
                    "status":       "VERIFIED",
                    "version":      1,
                    "checksum":     checksum,
                    "updated_at":   datetime.utcnow().isoformat() + "Z",
                }, on_conflict="id").execute()

                log_recovery_event(
                    "OPERATION_REPLAYED",
                    records_recovered=1,
                    details={"operation_id": operation_id, "advisory_id": advisory_id},
                )

            mark_operation_completed(operation_id)
            succeeded += 1
            logger.info(f"[Recovery] Replayed {operation_id}")

        except Exception as e:
            logger.error(f"[Recovery] Replay failed for {operation_id}: {e}")
            failed += 1

    log_recovery_event(
        "RECOVERY_COMPLETED",
        records_affected=len(pending),
        records_recovered=succeeded,
        records_unrecoverable=failed,
        details={"succeeded": succeeded, "failed": failed, "skipped": skipped},
    )

    return {
        "replayed":  len(pending),
        "succeeded": succeeded,
        "failed":    failed,
        "skipped":   skipped,
    }


# ── Demo Record Recovery (snapshot-based) ────────────────────────

def recover_demo_records_from_snapshots() -> dict:
    """
    For each blackout_demo_record that is UNAVAILABLE or CORRUPTED,
    try to restore from advisory_snapshots.
    Returns recovery summary.
    """
    client = _get_raw_supabase()
    if client is None:
        return {"error": "Supabase not configured"}

    log_recovery_event("RECOVERY_STARTED", details={"source": "snapshot_recovery"})

    try:
        # Get all demo records
        all_records = client.table("blackout_demo_records").select("*").execute()
        records = all_records.data or []
    except Exception as e:
        return {"error": str(e)}

    affected     = 0
    recovered    = 0
    unrecoverable = 0

    for rec in records:
        status = rec.get("status", "VERIFIED")
        if status in ("UNAVAILABLE", "CORRUPTED", "MISSING"):
            affected += 1
            snap = get_latest_snapshot(rec["id"])

            if snap:
                validation = validate_snapshot(snap)
                if validation["status"] == "VERIFIED":
                    # Restore from snapshot
                    try:
                        client.table("blackout_demo_records").update({
                            "advisory":    snap["content"],
                            "checksum":    snap["checksum"],
                            "status":      "RECOVERED",
                            "version":     snap["version"],
                            "updated_at":  datetime.utcnow().isoformat() + "Z",
                        }).eq("id", rec["id"]).execute()

                        log_recovery_event(
                            "RECORD_RESTORED",
                            records_recovered=1,
                            details={"record_id": rec["id"], "from_snapshot_version": snap["version"]},
                        )
                        recovered += 1
                    except Exception as e:
                        logger.error(f"[Recovery] Restore failed for {rec['id']}: {e}")
                        unrecoverable += 1
                else:
                    log_recovery_event(
                        "SNAPSHOT_VALIDATED",
                        details={"record_id": rec["id"], "result": "CORRUPTED"},
                    )
                    unrecoverable += 1
            else:
                unrecoverable += 1

    log_recovery_event(
        "RECOVERY_COMPLETED",
        records_affected=affected,
        records_recovered=recovered,
        records_unrecoverable=unrecoverable,
        details={"source": "snapshot_recovery"},
    )

    return {
        "records_affected":      affected,
        "records_recovered":     recovered,
        "records_unrecoverable": unrecoverable,
    }
