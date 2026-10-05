import os
import pandas as pd
from process_video import process_video

DATASET_PATH = "Gait_Video"
OUTPUT_CSV   = "gait_featuresv3.csv"
all_data     = []

for person_name in os.listdir(DATASET_PATH):
    person_folder = os.path.join(DATASET_PATH, person_name)

    if os.path.isdir(person_folder):
        print(f"\nProcessing {person_name}...")
        for video_file in os.listdir(person_folder):
            video_path = os.path.join(person_folder, video_file)

            print(f"  Processing video: {video_file}")

            window_features = process_video(video_path)

            if window_features is None:
                print("   Skipped (no features detected)")
                continue

            for feat in window_features:
                feat["label"] = person_name
                all_data.append(feat)

            print(f"    Extracted {len(window_features)} windows")

df = pd.DataFrame(all_data)
df = df.dropna()
df = df[(df["avg_knee_angle"] != 0) & (df["avg_hip_angle"] != 0)]
df.to_csv(OUTPUT_CSV, index=False)

print("\nDataset processing complete.")
print(f"Saved as: {OUTPUT_CSV}")
print(f"Total samples: {len(df)}")
print(f"Total unique persons: {df['label'].nunique()}")
print(f"Features: {list(df.columns[:-1])}")