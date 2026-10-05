import cv2
import mediapipe as mp
import numpy as np


def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return float(np.degrees(angle))


def extract_features_from_window(knee_angles, hip_angles, step_count, frame_count):
    """
    Compute 11 biomechanical gait features from a sliding window of pose data.
    """
    knee_arr = np.array(knee_angles)
    hip_arr = np.array(hip_angles)
    stride_length = len(knee_angles) / max(step_count, 1)
    walking_speed = frame_count / max(step_count, 1)

    return {
        "avg_knee_angle":  float(np.mean(knee_arr)),
        "std_knee_angle":  float(np.std(knee_arr)),
        "max_knee_angle":  float(np.max(knee_arr)),
        "min_knee_angle":  float(np.min(knee_arr)),
        "avg_hip_angle":   float(np.mean(hip_arr)),
        "std_hip_angle":   float(np.std(hip_arr)),
        "max_hip_angle":   float(np.max(hip_arr)),
        "min_hip_angle":   float(np.min(hip_arr)),
        "step_count":      step_count,
        "stride_length":   stride_length,
        "walking_speed":   walking_speed,
    }


def process_video(video_path, window_size=60, step_size=30):
    """
    Process a gait video using sliding windows to extract multiple feature rows.

    Args:
        video_path   : Path to the video file.
        window_size  : Number of frames per window (~2 seconds at 30 fps).
        step_size    : Frame step between consecutive windows (50% overlap = 30).

    Returns:
        List of feature dicts (one per window), or None if video has no pose detections.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("ERROR: Cannot open video:", video_path)
        return None

    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        static_image_mode=False,
        min_detection_confidence=0.3,
        min_tracking_confidence=0.3
    )

    # Collect per-frame data
    all_knee_angles = []
    all_hip_angles  = []
    all_step_flags  = []
    prev_y          = None
    threshold       = 0.02

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results   = pose.process(rgb_frame)

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark

            left_hip      = [lm[23].x, lm[23].y]
            left_knee     = [lm[25].x, lm[25].y]
            left_ankle    = [lm[27].x, lm[27].y]
            right_hip     = [lm[24].x, lm[24].y]
            right_knee    = [lm[26].x, lm[26].y]
            right_ankle   = [lm[28].x, lm[28].y]
            left_shoulder = [lm[11].x, lm[11].y]
            right_shoulder= [lm[12].x, lm[12].y]

            knee_angle = (
                calculate_angle(left_hip,  left_knee,  left_ankle) +
                calculate_angle(right_hip, right_knee, right_ankle)
            ) / 2

            hip_angle = (
                calculate_angle(left_shoulder, left_hip,  left_knee) +
                calculate_angle(right_shoulder, right_hip, right_knee)
            ) / 2

            all_knee_angles.append(knee_angle)
            all_hip_angles.append(hip_angle)

            current_y = left_ankle[1]
            step = 1 if (prev_y is not None and abs(current_y - prev_y) > threshold) else 0
            all_step_flags.append(step)
            prev_y = current_y
        else:
            # No pose detected this frame — fill with zeros to preserve timeline
            if all_knee_angles:
                all_knee_angles.append(all_knee_angles[-1])
                all_hip_angles.append(all_hip_angles[-1])
            else:
                all_knee_angles.append(0.0)
                all_hip_angles.append(0.0)
            all_step_flags.append(0)

    cap.release()
    pose.close()

    total_frames = len(all_knee_angles)
    if total_frames < window_size:
        # Video shorter than one window — use whole video as single sample
        if sum(all_step_flags) == 0 and not any(all_knee_angles):
            return None
        feat = extract_features_from_window(
            all_knee_angles, all_hip_angles,
            sum(all_step_flags), total_frames
        )
        return [feat]

    # Sliding window extraction
    window_features = []
    for start in range(0, total_frames - window_size + 1, step_size):
        end          = start + window_size
        knee_win     = all_knee_angles[start:end]
        hip_win      = all_hip_angles[start:end]
        steps_in_win = sum(all_step_flags[start:end])

        # Skip windows with no pose data
        if max(knee_win) == 0:
            continue

        feat = extract_features_from_window(knee_win, hip_win, steps_in_win, window_size)
        window_features.append(feat)

    return window_features if window_features else None
