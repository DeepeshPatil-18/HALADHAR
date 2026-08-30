"""
scheme_source.py — Government scheme aggregation for KrishiMitra.

Cache strategy: 7-day staleness threshold.
Data flow: Supabase cache (if fresh) → myScheme.gov.in → Supabase cache (fallback) → 503

Never returns fabricated scheme data.
Swap this module to change scheme source without touching routes.
"""
import os
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from models import SchemeRecord, SchemesResponse
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
MYSCHEME_API_URL = "https://www.myscheme.gov.in/api/v1/schemes"  # placeholder

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

CACHE_FRESHNESS_DAYS = 7


async def fetch_schemes(
    state: str, district: str, enterprise_type: str, crop: str | None
) -> SchemesResponse:
    """
    Fetch government schemes with Supabase cache fallback.

    1. Check Supabase cache for records fresh within 7 days
    2. If stale/empty, fetch from myScheme.gov.in and upsert to cache
    3. If live fetch fails, return last cached records (any age) with cache_timestamp
    4. Only raise 503 if both live and cache are unavailable
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail={"error": "Supabase not configured", "retryable": False},
        )

    # 1. Check cache
    cached_schemes = await _check_cache(state, district, enterprise_type, crop)
    if cached_schemes is not None:
        return cached_schemes

    # 2. Fetch live data
    try:
        live_schemes = await _fetch_from_myscheme(state, district, enterprise_type, crop)
        await _upsert_to_cache(live_schemes, state, district, enterprise_type, crop)
        return SchemesResponse(schemes=live_schemes, cache_timestamp=None)
    except Exception:
        # 3. Fallback to stale cache
        stale_schemes = await _get_stale_cache(state, district, enterprise_type, crop)
        if stale_schemes:
            timestamp = datetime.now(timezone.utc).isoformat()
            return SchemesResponse(schemes=stale_schemes, cache_timestamp=timestamp)

        # 4. No data available
        raise HTTPException(
            status_code=503,
            detail={
                "error": f"Scheme data unavailable for {enterprise_type} in {district}, {state}",
                "retryable": True,
            },
        )


async def _check_cache(
    state: str, district: str, enterprise_type: str, crop: str | None
) -> SchemesResponse | None:
    """Return fresh cached schemes if available."""
    if not supabase:
        return None

    cutoff = datetime.now(timezone.utc) - timedelta(days=CACHE_FRESHNESS_DAYS)
    query = (
        supabase.table("schemes")
        .select("*")
        .eq("state", state)
        .eq("district", district)
        .eq("enterprise_type", enterprise_type)
        .gte("last_fetched", cutoff.isoformat())
    )

    if crop:
        query = query.ilike("applicable_crops", f"%{crop}%")

    response = query.execute()
    records = response.data

    if records:
        schemes = [
            SchemeRecord(
                scheme_id=r["scheme_id"],
                name=r["name"],
                description=r["description"],
                eligibility=r["eligibility"],
                benefits=r["benefits"],
                official_link=r["official_link"],
                state=r["state"],
                district=r.get("district"),
                enterprise_type=r.get("enterprise_type"),
                applicable_crops=r.get("applicable_crops"),
            )
            for r in records
        ]
        return SchemesResponse(schemes=schemes, cache_timestamp=None)

    return None


async def _fetch_from_myscheme(
    state: str, district: str, enterprise_type: str, crop: str | None
) -> list[SchemeRecord]:
    """
    Fetch schemes from myScheme.gov.in API.
    
    TODO: Replace this stub with actual API integration.
    myScheme.gov.in does not have a well-documented public JSON API.
    This may require structured scraping or official partnership.
    """
    # Placeholder - in real implementation:
    # - Call myScheme.gov.in API/scraper
    # - Parse results into SchemeRecord objects
    # - Return list
    raise Exception("myScheme.gov.in integration not implemented")


async def _upsert_to_cache(
    schemes: list[SchemeRecord], state: str, district: str, enterprise_type: str, crop: str | None
):
    """Upsert fetched schemes to Supabase cache."""
    if not supabase or not schemes:
        return

    timestamp = datetime.now(timezone.utc).isoformat()
    records = [
        {
            "scheme_id": s.scheme_id,
            "name": s.name,
            "description": s.description,
            "eligibility": s.eligibility,
            "benefits": s.benefits,
            "official_link": s.official_link,
            "state": s.state,
            "district": s.district,
            "enterprise_type": s.enterprise_type,
            "applicable_crops": s.applicable_crops,
            "last_fetched": timestamp,
        }
        for s in schemes
    ]

    supabase.table("schemes").upsert(records, on_conflict="scheme_id").execute()


async def _get_stale_cache(
    state: str, district: str, enterprise_type: str, crop: str | None
) -> list[SchemeRecord] | None:
    """Return any cached schemes, regardless of age."""
    if not supabase:
        return None

    query = (
        supabase.table("schemes")
        .select("*")
        .eq("state", state)
        .eq("district", district)
        .eq("enterprise_type", enterprise_type)
    )

    if crop:
        query = query.ilike("applicable_crops", f"%{crop}%")

    response = query.execute()
    records = response.data

    if records:
        return [
            SchemeRecord(
                scheme_id=r["scheme_id"],
                name=r["name"],
                description=r["description"],
                eligibility=r["eligibility"],
                benefits=r["benefits"],
                official_link=r["official_link"],
                state=r["state"],
                district=r.get("district"),
                enterprise_type=r.get("enterprise_type"),
                applicable_crops=r.get("applicable_crops"),
            )
            for r in records
        ]

    return None
