import logging
from fastapi import APIRouter, HTTPException, Header, Query, Response, status
from typing import Optional, List
from ...core.supabase_client import get_supabase

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[dict], summary="Fetch analysis history")
async def get_history(
    limit: int = Query(default=50, le=200),
    authorization: Optional[str] = Header(None),
):
    try:
        supabase = get_supabase()
        response = (
            supabase.table("detections")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{record_id}", status_code=status.HTTP_200_OK)
@router.delete("/detections/{record_id}", status_code=status.HTTP_200_OK)
async def delete_record(
    record_id: str,
    authorization: Optional[str] = Header(None),
):
    try:
        supabase = get_supabase()
        response = supabase.table("detections").delete().eq("id", int(record_id)).execute()
        
        if hasattr(response, 'error') and response.error:
            logger.error(f"Supabase delete error: {response.error}")
            raise HTTPException(status_code=500, detail=f"Database error: {response.error}")
            
        if not response.data or len(response.data) == 0:
            logger.warning(f"No rows deleted for id={record_id}")
            raise HTTPException(status_code=404, detail="Record not found in DB")
            
        return {"success": True, "record_id": record_id}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid record_id format")
    except Exception as e:
        logger.error(f"Failed to delete record {record_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))




