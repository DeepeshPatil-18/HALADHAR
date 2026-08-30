"""
blackout_routes.py — FastAPI router for the HALADHAR Blackout demo.

Endpoints:
  GET  /api/system/health            — real DB health + blackout state + pending count
  POST /api/blackout/enable          — activate blackout simulation
  POST /api/blackout/disable         — deactivate + replay pending ops
  POST /api/blackout/snapshot        — create a verified advisory snapshot
  POST /api/blackout/queue-operation — queue an operation (called when DB unavailable)
  POST /api/blackout/simulate-loss   — corrupt/erase some blackout_demo_records
  POST /api/blackout/recover         — recover demo records from snapshots
  GET  /api/blackout/demo-records    — list all blackout_demo_records
  GET  /api/blackout/pending         — list pending operations
  GET  /api/blackout/log             — recent recovery log entries
"""

import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.blackout_service import (
    activate_blackout,
    deactivate_blackout,
    is_blackout_active,
    get_blackout_status,
    check_database_health,
    compute_checksum,
    verify_checksum,
    _get_raw_supabase,
)
from services.snapshot_service import save_snapshot, get_latest_snapshot, validate_snapshot
from services.recovery_service import (
    queue_pending_operation,
    get_pending_operations,
    get_pending_count,
    log_recovery_event,
    get_recent_recovery_log,
    replay_pending_operations,
    recover_demo_records_from_snapshots,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Blackout"])


# ── Pydantic models ───────────────────────────────────────────────

class SnapshotRequest(BaseModel):
    advisory_id: str
    farmer_id:   str
    content:     str
    version:     int = 1


class QueueOperationRequest(BaseModel):
    operation_id:   str
    operation_type: str
    payload:        dict


class EnableBlackoutRequest(BaseModel):
    reason: str = "Manual simulation for demo"


# ══════════════════════════════════════════════════════════════════
# HEALTH
# ══════════════════════════════════════════════════════════════════

@router.get("/system/health")
async def system_health():
    """
    Real health check — queries Supabase directly.
    Returns current blackout state + pending operation count.
    """
    health  = check_database_health()
    pending = get_pending_count()

    # Determine last backup time from most recent snapshot
    last_backup = None
    client = _get_raw_supabase()
    if client:
        try:
            snap = client.table("advisory_snapshots").select("created_at").order(
                "created_at", desc=True
            ).limit(1).execute()
            if snap.data:
                last_backup = snap.data[0]["created_at"]
        except Exception:
            pass

    return {
        "database":          health["database"],
        "recovery_store":    "ready",
        "pending_operations": pending,
        "last_backup":       last_backup,
        "blackout":          get_blackout_status(),
        "detail":            health.get("detail"),
    }


# ══════════════════════════════════════════════════════════════════
# BLACKOUT CONTROL
# ══════════════════════════════════════════════════════════════════

@router.post("/blackout/enable")
async def enable_blackout(req: EnableBlackoutRequest = EnableBlackoutRequest()):
    """Activate the database blackout simulation."""
    status = activate_blackout(req.reason)
    log_recovery_event(
        "DATABASE_FAILURE",
        details={"reason": req.reason, "activated_at": datetime.utcnow().isoformat() + "Z"},
    )
    return {
        "success": True,
        "message": "Blackout simulation activated. All Supabase writes will now fail.",
        "blackout": status,
    }


@router.post("/blackout/disable")
async def disable_blackout():
    """
    Deactivate the blackout and replay all pending operations.
    Returns replay summary.
    """
    status = deactivate_blackout()
    log_recovery_event(
        "DATABASE_RESTORED",
        details={"restored_at": datetime.utcnow().isoformat() + "Z"},
    )

    # Replay pending ops now that DB is available
    replay_result = replay_pending_operations()

    return {
        "success": True,
        "message": "Database access restored.",
        "blackout": status,
        "replay":  replay_result,
    }


# ══════════════════════════════════════════════════════════════════
# SNAPSHOTS
# ══════════════════════════════════════════════════════════════════

@router.post("/blackout/snapshot")
async def create_snapshot(req: SnapshotRequest):
    """
    Create a verified advisory snapshot.
    Called by the frontend after a successful advisory save.
    """
    result = save_snapshot(
        advisory_id=req.advisory_id,
        farmer_id=req.farmer_id,
        content=req.content,
        version=req.version,
    )

    if not result.get("saved"):
        raise HTTPException(status_code=500, detail=result.get("error", "Snapshot failed"))

    log_recovery_event(
        "SNAPSHOT_CREATED",
        records_recovered=1,
        details={
            "advisory_id": req.advisory_id,
            "farmer_id":   req.farmer_id,
            "checksum":    result.get("checksum", "")[:16],
        },
    )

    return {
        "success":  True,
        "checksum": result.get("checksum"),
        "snapshot": result.get("snapshot"),
    }


# ══════════════════════════════════════════════════════════════════
# PENDING OPERATIONS
# ══════════════════════════════════════════════════════════════════

@router.post("/blackout/queue-operation")
async def queue_operation(req: QueueOperationRequest):
    """
    Queue an operation that failed due to blackout.
    Called by the frontend when a Supabase write is rejected.
    """
    if not is_blackout_active():
        # If blackout is off, just acknowledge — the frontend will retry normally
        return {
            "queued": False,
            "message": "Blackout not active — no need to queue.",
        }

    result = queue_pending_operation(
        operation_id=req.operation_id,
        operation_type=req.operation_type,
        payload=req.payload,
    )

    return {"queued": result.get("queued", False), "operation_id": req.operation_id}


@router.get("/blackout/pending")
async def get_pending():
    """List all pending operations."""
    ops = get_pending_operations("pending")
    return {"count": len(ops), "operations": ops}


# ══════════════════════════════════════════════════════════════════
# SIMULATION — DATA LOSS
# ══════════════════════════════════════════════════════════════════

@router.post("/blackout/simulate-loss")
async def simulate_data_loss():
    """
    Safely corrupt/erase some blackout_demo_records to simulate data loss.
    Never touches real farmer data.
    Returns the affected record IDs.
    """
    client = _get_raw_supabase()
    if not client:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    try:
        # Get all demo records
        all_recs = client.table("blackout_demo_records").select("id,farmer_name").execute()
        records  = all_recs.data or []

        if not records:
            return {"message": "No demo records found. Create a snapshot first.", "affected": []}

        affected = []
        now = datetime.utcnow().isoformat() + "Z"

        # Before corrupting: ensure each has a snapshot for recovery
        for i, rec in enumerate(records):
            snap = get_latest_snapshot(rec["id"])
            if not snap:
                # Create a snapshot first so recovery actually works
                full = client.table("blackout_demo_records").select("*").eq("id", rec["id"]).single().execute()
                if full.data and full.data.get("advisory"):
                    save_snapshot(
                        advisory_id=rec["id"],
                        farmer_id=full.data.get("farmer_name", "unknown"),
                        content=full.data["advisory"],
                        version=1,
                    )

        # Corrupt alternating records
        for i, rec in enumerate(records):
            if i % 2 == 0:
                # MISSING: erase content
                client.table("blackout_demo_records").update({
                    "advisory":    "",
                    "status":      "UNAVAILABLE",
                    "updated_at":  now,
                }).eq("id", rec["id"]).execute()
                affected.append({"id": rec["id"], "farmer": rec.get("farmer_name"), "damage": "MISSING"})
            else:
                # CORRUPTED: tamper checksum only
                client.table("blackout_demo_records").update({
                    "checksum":   "CORRUPTED_" + rec["id"][:8],
                    "status":     "CORRUPTED",
                    "updated_at": now,
                }).eq("id", rec["id"]).execute()
                affected.append({"id": rec["id"], "farmer": rec.get("farmer_name"), "damage": "CORRUPTED"})

        log_recovery_event(
            "DATABASE_FAILURE",
            records_affected=len(affected),
            details={"simulation": "data_loss", "affected_ids": [a["id"] for a in affected]},
        )

        return {
            "success":  True,
            "affected": affected,
            "message":  f"{len(affected)} demo records corrupted/erased. Real farmer data untouched.",
        }
    except Exception as e:
        logger.error(f"[Blackout] Simulate loss failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════
# RECOVERY
# ══════════════════════════════════════════════════════════════════

@router.post("/blackout/recover")
async def recover_data():
    """
    Recover damaged demo records from validated snapshots.
    Returns real recovery counts.
    """
    result = recover_demo_records_from_snapshots()

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "success":               True,
        "records_affected":      result["records_affected"],
        "records_recovered":     result["records_recovered"],
        "records_unrecoverable": result["records_unrecoverable"],
        "message": (
            f"{result['records_recovered']} record(s) restored from verified snapshots. "
            f"{result['records_unrecoverable']} could not be recovered."
        ),
    }


# ══════════════════════════════════════════════════════════════════
# DEMO RECORDS
# ══════════════════════════════════════════════════════════════════

@router.get("/blackout/demo-records")
async def get_demo_records():
    """List all blackout_demo_records with their current status."""
    client = _get_raw_supabase()
    if not client:
        raise HTTPException(status_code=503, detail="Supabase not configured")

    try:
        result = client.table("blackout_demo_records").select("*").order(
            "created_at", desc=False
        ).execute()

        records = result.data or []

        # Enrich with integrity check
        enriched = []
        for rec in records:
            stored_status = rec.get("status", "VERIFIED")
            # Do a real checksum verification if content is present
            if rec.get("advisory") and rec.get("checksum"):
                integrity = verify_checksum(rec["advisory"], rec["checksum"])
                if integrity == "CORRUPTED" and stored_status not in ("CORRUPTED",):
                    stored_status = "CORRUPTED"
            enriched.append({**rec, "integrity": stored_status})

        return {"records": enriched, "count": len(enriched)}
    except Exception as e:
        logger.error(f"[Blackout] Get demo records failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════
# RECOVERY LOG
# ══════════════════════════════════════════════════════════════════

@router.get("/blackout/log")
async def get_recovery_log():
    """Return the most recent recovery log entries."""
    entries = get_recent_recovery_log(limit=30)
    return {"entries": entries, "count": len(entries)}
