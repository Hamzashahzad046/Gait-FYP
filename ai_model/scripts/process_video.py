import cv2
import mediapipe as mp
import numpy as np
from scipy.signal import find_peaks

def calculate_angle(a, b, c) -> float:
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return float(np.degrees(angle))

def process_video(video_path: str):
    cap = cv2.VideoCapture(video_path)
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    knee_angles, hip_angles, relative_strides, frame_count = [], [], [], 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break
        frame_count += 1
        
        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            # Landmarks: Hip (23/24), Knee (25/26), Ankle (27/28), Shoulder (11/12)
            left_hip, left_knee, left_ankle = [lm[23].x, lm[23].y], [lm[25].x, lm[25].y], [lm[27].x, lm[27].y]
            right_hip, right_knee, right_ankle = [lm[24].x, lm[24].y], [lm[26].x, lm[26].y], [lm[28].x, lm[28].y]
            left_shoulder, right_shoulder = [lm[11].x, lm[11].y], [lm[12].x, lm[12].y]
            
            knee_angle = (calculate_angle(left_hip, left_knee, left_ankle) + calculate_angle(right_hip, right_knee, right_ankle)) / 2
            hip_angle = (calculate_angle(left_shoulder, left_hip, left_knee) + calculate_angle(right_shoulder, right_hip, right_knee)) / 2
            knee_angles.append(knee_angle)
            hip_angles.append(hip_angle)
            
            # Stride normalization: Ankle distance / Body height
            body_height = max(abs(((left_shoulder[1] + right_shoulder[1]) / 2) - ((left_ankle[1] + right_ankle[1]) / 2)), 0.1)
            ankle_dist = np.sqrt((left_ankle[0] - right_ankle[0])**2 + (left_ankle[1] - right_ankle[1])**2)
            relative_strides.append(ankle_dist / body_height)

    cap.release()
    pose.close()
    
    if len(knee_angles) < 10: return None
    
    # Accurate Step Count Calculation
    peaks, _ = find_peaks(knee_angles, distance=15, prominence=2.0)
    step_count = len(peaks)
    
    # Feature Vector Construction
    features = {
        "avg_knee": np.mean(knee_angles), "std_knee": np.std(knee_angles),
        "max_knee": np.max(knee_angles), "min_knee": np.min(knee_angles),
        "avg_hip": np.mean(hip_angles), "std_hip": np.std(hip_angles),
        "max_hip": np.max(hip_angles), "min_hip": np.min(hip_angles),
        "step_count": float(step_count),
        "stride_length": float(np.clip(np.mean(relative_strides), 0.35, 1.25)),
        "walking_speed": float(frame_count / max(step_count, 1))
    }
    return features

