from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

class UserCreate(BaseModel):
    email:     EmailStr
    password:  str
    full_name: str

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         Dict[str, Any]

class AnalysisMetrics(BaseModel):
    avg_knee_angle: float
    avg_hip_angle:  float
    stride_length:  float
    step_count:     int

class AnalysisResult(BaseModel):
    person:     str
    confidence: float
    metrics:    AnalysisMetrics
    timestamp:  str

class FaceAnalysisResult(BaseModel):
    verified:         bool
    distance:         float
    threshold:        Optional[float] = 0.68
    similarity_score: float
    model:            str
    detector_backend: str
    error:            Optional[str] = None

class DualAnalysisResult(BaseModel):
    identity_status:  str
    final_confidence: float
    gait_analysis:    Dict[str, Any]
    face_analysis:    FaceAnalysisResult

class LabelPersonRequest(BaseModel):
    """Sent by the frontend to label an Unknown detection after analysis."""
    person_name: str

class DetectionRecord(BaseModel):
    """Shape of a row in the detections table (returned from history queries)."""
    id:             str
    user_id:        str
    person_name:    str
    confidence:     float
    avg_knee_angle: Optional[float] = None
    avg_hip_angle:  Optional[float] = None
    stride_length:  Optional[float] = None
    step_count:     Optional[int]   = None
    video_filename: Optional[str]   = None
    is_identified:  bool            = False
    created_at:     str

class StatsResponse(BaseModel):
    total_scans:      int
    identified_users: int
    last_scan_time:   Optional[str]
    last_person:      Optional[str]
