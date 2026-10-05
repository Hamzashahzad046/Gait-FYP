from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ...core.supabase_client import get_supabase
from ...models.schemas import StatsResponse

router = APIRouter()

@router.get("/stats", response_model=StatsResponse, summary="Get system statistics")
async def get_stats(authorization: Optional[str] = Header(None)):
    """
    Returns dashboard statistics: total scans, distinct identified persons,
    last scan time and person name.
    """
    try:
        supabase = get_supabase()
        count_resp = (
            supabase.table("detections")
            .select("id", count="exact")
            .execute()
        )
        total_scans = count_resp.count or 0
        persons_resp = (
            supabase.table("detections")
            .select("person_name")
            .neq("person_name", "Unknown")
            .execute()
        )
        identified_users = len(set(
            row["person_name"]
            for row in (persons_resp.data or [])
            if row.get("person_name")
        ))
        last_resp = (
            supabase.table("detections")
            .select("created_at, person_name")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        last_row   = (last_resp.data or [None])[0]
        last_time  = last_row["created_at"]  if last_row else None
        last_person = last_row["person_name"] if last_row else None

        return {
            "total_scans":      total_scans,
            "identified_users": identified_users,
            "last_scan_time":   last_time,
            "last_person":      last_person,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")
