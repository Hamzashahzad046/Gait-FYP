import os
import cv2
import numpy as np
from typing import Dict, Any, Union, Optional
from deepface import DeepFace

class FaceVerificationService:
    """
    Production-grade Face Verification Service using DeepFace.
    """

    DEFAULT_MODEL = "VGG-Face"
    DEFAULT_DETECTOR = "opencv"
    DEFAULT_METRIC = "cosine"

    @classmethod
    def verify_faces(
        cls,
        img1_input: Union[str, np.ndarray],
        img2_input: Union[str, np.ndarray],
        model_name: str = DEFAULT_MODEL,
        detector_backend: str = DEFAULT_DETECTOR,
    ) -> Dict[str, Any]:
        """
        Verifies whether two face images belong to the same person.

        Args:
            img1_input: File path or NumPy image array for the first face.
            img2_input: File path or NumPy image array for the second face.
            model_name: DeepFace model name ('VGG-Face', 'Facenet', etc.).
            detector_backend: Backend detector ('opencv', 'retinaface', etc.).

        Returns:
            Structured dict containing verified (bool), distance (float),
            similarity_score (float), model (str), detector_backend (str).
        """
        try:
            result = DeepFace.verify(
                img1_path=img1_input,
                img2_path=img2_input,
                model_name=model_name,
                detector_backend=detector_backend,
                distance_metric=cls.DEFAULT_METRIC,
                enforce_detection=False,
                align=True,
                silent=True,
            )

            distance = float(result.get("distance", 1.0))
            threshold = float(result.get("threshold", 0.68))
            is_verified = bool(result.get("verified", False))

            # Compute normalized similarity score (0.0 to 1.0)
            if threshold > 0:
                normalized_score = 1.0 - (distance / (threshold * 1.5))
            else:
                normalized_score = 1.0 - distance

            similarity_score = round(max(0.0, min(1.0, normalized_score)), 4)

            return {
                "verified": is_verified,
                "distance": round(distance, 4),
                "threshold": round(threshold, 4),
                "similarity_score": similarity_score,
                "model": model_name,
                "detector_backend": detector_backend,
            }

        except Exception as e:
            return {
                "verified": False,
                "distance": 1.0,
                "threshold": 0.68,
                "similarity_score": 0.0,
                "model": model_name,
                "detector_backend": detector_backend,
                "error": str(e),
            }

    @classmethod
    def extract_face_frame(cls, video_path: str) -> Optional[np.ndarray]:
        """
        Extracts the best face frame from a video file using OpenCV.
        """
        if not os.path.exists(video_path):
            return None

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None

        haar_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        face_cascade = cv2.CascadeClassifier(haar_path)

        best_frame = None
        max_face_area = 0

        try:
            frame_count = 0
            while cap.isOpened() and frame_count < 150:  # Check first 150 frames
                ret, frame = cap.read()
                if not ret:
                    break
                frame_count += 1

                if frame_count % 3 != 0:
                    continue

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(
                    gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40)
                )

                for (x, y, w, h) in faces:
                    area = w * h
                    if area > max_face_area:
                        max_face_area = area
                        best_frame = frame.copy()

            return best_frame
        finally:
            cap.release()
