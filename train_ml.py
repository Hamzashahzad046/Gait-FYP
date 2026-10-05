import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# All 11 biomechanical gait features extracted via sliding window video analysis
FEATURE_COLS = [
    "avg_knee_angle", "std_knee_angle", "max_knee_angle", "min_knee_angle",
    "avg_hip_angle",  "std_hip_angle",  "max_hip_angle",  "min_hip_angle",
    "step_count", "stride_length", "walking_speed"
]

# Use the windowed video gait dataset
csv_path = "gait_featuresv3.csv"

print(f"Loading Video Gait Dataset from: {csv_path}")
data = pd.read_csv(csv_path)

print("Dataset Loaded Successfully!")
print(f"Total samples: {len(data)}")
print(data.head())

# Features X and Target y
available_features = [c for c in FEATURE_COLS if c in data.columns]
X = data[available_features]
y = data["label"]

print(f"\nFeature Columns ({len(X.columns)}): {list(X.columns)}")
print(f"Total Unique Persons: {y.nunique()}")

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# Train RandomForest (best for tabular multi-class gait data)
print("\nTraining Gait Recognition Model (RandomForest)...")
# Synthetic Gaussian Noise Data Augmentation (2x samples)
import numpy as np
noise_factor = 0.05
X_aug = X_scaled + np.random.normal(0, noise_factor, X_scaled.shape)
X_augmented = np.vstack([X_scaled, X_aug])
y_augmented = np.concatenate([y_encoded, y_encoded])

# Train/Test split on augmented data
X_train, X_test, y_train, y_test = train_test_split(
    X_augmented,
    y_augmented,
    test_size=0.2,
    random_state=42,
    stratify=y_augmented
)

# Train RandomForest with optimized parameters
print("\nTraining Gait Recognition Model (RandomForest)...")
model = RandomForestClassifier(
    n_estimators=500,
    max_depth=12,
    min_samples_split=3,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n==========================================")
print(f" Video Model Accuracy: {accuracy * 100:.2f}%")
print(f"==========================================\n")

print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_, zero_division=0))

# Save trained artifacts
joblib.dump(model, "gait_model2.pkl")
joblib.dump(le, "label_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel saved successfully for Backend & Frontend:")
print(" - gait_model2.pkl")
print(" - label_encoder.pkl")
print(" - scaler.pkl")
print(f" - Features used: {list(X.columns)}")



