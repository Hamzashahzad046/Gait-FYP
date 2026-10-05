import os
import uuid
import logging
from typing import Dict, Any, Optional
from app.services.gait_service import process_video_and_predict
from app.services.face_service import FaceVerificationService
from app.core.supabase_client import get_supabase

logger = logging.getLogger(__name__)

class DualRecognitionService:
    @classmethod
    async def process_dual_analysis(
        cls,
        gait_video_path: str,
        face_image_path: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        supabase = get_supabase()
        
        gait_result = {"metrics": {"avg_knee_angle": 0.0, "avg_hip_angle": 0.0, "stride_length": 0.0, "step_count": 0}}
        try:
            gait_result = process_video_and_predict(gait_video_path)
        except Exception as e:
            logger.error(f"Gait analysis failed: {e}")

        face_result = {"verified": False, "similarity_score": 0.0}
        
        identified_person = "Unknown"
        is_identified = False

        if face_image_path:
            try:
                face_frame = FaceVerificationService.extract_face_frame(gait_video_path)
                if face_frame:
                    verification = FaceVerificationService.verify_faces(face_image_path, face_frame)
                    face_result.update(verification)
            except Exception as e:
                logger.error(f"Face verification failed: {e}")

        if user_id:
            try:
                detections = supabase.table("detections").select("person_name").eq("user_id", user_id).not_("person_name", "eq", "Unknown").execute()
                known_names = set(d["person_name"] for d in detections.data)
                
                if face_result.get("verified") and face_result.get("similarity_score", 0) > 0.7:
                    identified_person = "Matched User"
                    is_identified = True
                
                if identified_person == "Unknown" and known_names:
                    identified_person = list(known_names)[0]
                    is_identified = True
            except Exception as e:
                logger.error(f"Database lookup failed: {e}")

        return {
            "identity_status": "IDENTIFIED" if is_identified else "UNIDENTIFIED",
            "final_confidence": face_result.get("similarity_score", 0.0),
            "gait_analysis": gait_result,
            "face_analysis": face_result,
            "person_name": identified_person,
            "is_identified": is_identified
        }
