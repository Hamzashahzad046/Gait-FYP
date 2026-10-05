import pandas as pd
df = pd.read_csv("gait_features_v2.csv")

print("Before cleaning:")
print(df)
df = df.dropna()
df = df.dropna()
df = df[(df["avg_knee_angle"] != 0) & (df["avg_hip_angle"] != 0)]
df = df.reset_index(drop=True)
df.to_csv("gait_featuresv3.csv", index=False)

print("\nAfter cleaning:")
print(df)