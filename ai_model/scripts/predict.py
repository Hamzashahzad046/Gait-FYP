import joblib
import numpy as np
from process_video import process_video

def predict(video_path):
    model = joblib.load("gait_model2.pkl")
    scaler = joblib.load("scaler.pkl")
    encoder = joblib.load("label_encoder.pkl")
    
    features = process_video(video_path)
    if not features:
        return "Unknown - No Pose"
        
    scaled = scaler.transform([features])
    pred = model.predict(scaled)
    return encoder.inverse_transform(pred)[0]

if __name__ == "__main__":
    # Test stub
    # print(predict("test_video.mp4"))
    print("Predict module ready.")

