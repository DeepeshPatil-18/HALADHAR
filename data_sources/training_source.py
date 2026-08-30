"""
training_source.py — Agricultural training resource aggregation for KrishiMitra.

Cache strategy: 14-day staleness threshold.
Data flow: Supabase cache (if fresh) → ICAR/KVK API → Supabase cache (fallback) → 503

Never returns fabricated training data.
Swap this module to change training source without touching routes.
"""
import os
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from models import TrainingResource, TrainingResponse
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
ICAR_API_URL = "https://icar.org.in/api/training"  # placeholder

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

CACHE_FRESHNESS_DAYS = 14


async def fetch_training(
    enterprise_type: str, language: str | None
) -> TrainingResponse:
    """
    Fetch training resources with Supabase cache fallback.

    1. Check Supabase cache for records fresh within 14 days
    2. If stale/empty, fetch from ICAR/KVK and upsert to cache
    3. If live fetch fails, return last cached records (any age) with cache_timestamp
    4. Only raise 503 if both live and cache are unavailable
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail={"error": "Supabase not configured", "retryable": False},
        )

    # 1. Check cache
    cached_training = await _check_cache(enterprise_type, language)
    if cached_training is not None:
        return cached_training

    # 2. Fetch live data
    try:
        live_resources = await _fetch_from_icar(enterprise_type, language)
        await _upsert_to_cache(live_resources, enterprise_type)
        return TrainingResponse(resources=live_resources, cache_timestamp=None)
    except Exception:
        # 3. Fallback to stale cache
        stale_resources = await _get_stale_cache(enterprise_type, language)
        if stale_resources:
            timestamp = datetime.now(timezone.utc).isoformat()
            return TrainingResponse(resources=stale_resources, cache_timestamp=timestamp)

        # 4. No data available
        raise HTTPException(
            status_code=503,
            detail={
                "error": f"Training data unavailable for {enterprise_type}",
                "retryable": True,
            },
        )


async def _check_cache(
    enterprise_type: str, language: str | None
) -> TrainingResponse | None:
    """Return fresh cached training resources if available."""
    if not supabase:
        return None

    cutoff = datetime.now(timezone.utc) - timedelta(days=CACHE_FRESHNESS_DAYS)
    query = (
        supabase.table("training_resources")
        .select("*")
        .eq("enterprise_type", enterprise_type)
        .gte("last_fetched", cutoff.isoformat())
    )

    if language:
        query = query.eq("language", language)

    response = query.execute()
    records = response.data

    if records:
        resources = [
            TrainingResource(
                resource_id=r["resource_id"],
                topic=r["topic"],
                language=r["language"],
                duration=r.get("duration"),
                description=r["description"],
                source_link=r["source_link"],
                enterprise_type=r.get("enterprise_type"),
            )
            for r in records
        ]
        return TrainingResponse(resources=resources, cache_timestamp=None)

    return None


async def _fetch_from_icar(
    enterprise_type: str, language: str | None
) -> list[TrainingResource]:
    """
    Fetch training resources from ICAR/KVK API.
    
    TODO: Replace this stub with actual API integration.
    ICAR and KVK portals do not have well-documented public JSON APIs.
    This may require structured scraping or official partnership.
    """
    # Placeholder - in real implementation:
    # - Call ICAR/KVK API/scraper
    # - Parse results into TrainingResource objects
    # - Return list
    raise Exception("ICAR/KVK integration not implemented")


async def _upsert_to_cache(resources: list[TrainingResource], enterprise_type: str):
    """Upsert fetched training resources to Supabase cache."""
    if not supabase or not resources:
        return

    timestamp = datetime.now(timezone.utc).isoformat()
    records = [
        {
            "resource_id": r.resource_id,
            "topic": r.topic,
            "language": r.language,
            "duration": r.duration,
            "description": r.description,
            "source_link": r.source_link,
            "enterprise_type": r.enterprise_type,
            "last_fetched": timestamp,
        }
        for r in resources
    ]

    supabase.table("training_resources").upsert(records, on_conflict="resource_id").execute()


async def _get_stale_cache(
    enterprise_type: str, language: str | None
) -> list[TrainingResource] | None:
    """Return any cached training resources, regardless of age."""
    if not supabase:
        return None

    query = (
        supabase.table("training_resources")
        .select("*")
        .eq("enterprise_type", enterprise_type)
    )

    if language:
        query = query.eq("language", language)

    response = query.execute()
    records = response.data

    if records:
        return [
            TrainingResource(
                resource_id=r["resource_id"],
                topic=r["topic"],
                language=r["language"],
                duration=r.get("duration"),
                description=r["description"],
                source_link=r["source_link"],
                enterprise_type=r.get("enterprise_type"),
            )
            for r in records
        ]

    return None
