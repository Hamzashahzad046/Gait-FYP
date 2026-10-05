from datetime import datetime, timezone
import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from app.models.schemas import AnalysisResult, DualAnalysisResult
from app.services.gait_service import process_video_and_predict
from app.services.dual_recognition_service import DualRecognitionService
from app.core.supabase_client import get_supabase

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_VIDEO_EXTENSIONS = ('.mp4', '.avi', '.mov', '.mpeg', '.mkv')

@router.post("/", response_model=AnalysisResult, summary="Analyze a gait video")
async def analyze_video(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
):
    filename_lower = (file.filename or "").lower()
    if not any(filename_lower.endswith(ext) for ext in ALLOWED_VIDEO_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Invalid video format")
        
    temp_dir = os.environ.get("TEMP", "/tmp")
    temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{file.filename}")
    
    try:
        with open(temp_path, "wb") as buf:
            buf.write(await file.read())
            
        result = process_video_and_predict(temp_path)
        return result
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/dual", response_model=DualAnalysisResult, summary="Dual-Modal Analysis (Gait + Face)")
async def analyze_dual(
    file: UploadFile = File(...),
    face_file: Optional[UploadFile] = File(None),
    authorization: Optional[str] = Header(None),
):
    temp_dir = os.environ.get("TEMP", "/tmp")
    temp_video_path = os.path.join(temp_dir, f"vid_{uuid.uuid4()}_{file.filename}")
    temp_face_path = None
    
    supabase = get_supabase()
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            user = supabase.auth.get_user(token)
            user_id = user.user.id
        except Exception:
            pass

    try:
        with open(temp_video_path, "wb") as buf:
            buf.write(await file.read())
            
        if face_file:
            temp_face_path = os.path.join(temp_dir, f"face_{uuid.uuid4()}_{face_file.filename}")
            with open(temp_face_path, "wb") as buf:
                buf.write(await face_file.read())
                
        result = await DualRecognitionService.process_dual_analysis(
            gait_video_path=temp_video_path,
            face_image_path=temp_face_path,
            user_id=user_id
        )
        
        if user_id:
            try:
                metrics = result["gait_analysis"].get("metrics", {})
                supabase.table("detections").insert({
                    "user_id": user_id,
                    "person_name": result["person_name"],
                    "confidence": result["final_confidence"],
                    "avg_knee_angle": metrics.get("avg_knee_angle"),
                    "avg_hip_angle": metrics.get("avg_hip_angle"),
                    "stride_length": metrics.get("stride_length"),
                    "step_count": metrics.get("step_count"),
                    "is_identified": result["is_identified"],
                    "video_filename": file.filename,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }).execute()
            except Exception as e:
                logger.error(f"DB insert failed: {e}")

        return result
    except Exception as e:
        logger.error(f"Dual analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for p in [temp_video_path, temp_face_path]:
            if p and os.path.exists(p):
                os.remove(p)

