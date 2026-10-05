# GaitGuard — Gait-Based Human Identification System

A full-stack application for identifying individuals based on their walking gait patterns using Machine Learning.

## 📁 Project Structure

```
FYP ML/
│
├── ai-model/                    # 🤖 Machine Learning Module
│   ├── models/                  #    Trained model files (.pkl)
│   ├── data/                    #    Datasets & CSVs
│   ├── scripts/                 #    ML scripts
│   │   ├── process_video.py     #    Video → pose feature extraction (MediaPipe)
│   │   ├── process_dataset.py   #    Batch process all training videos
│   │   ├── train_ml.py          #    Train SVM model
│   │   ├── clean_dataset.py     #    Data cleaning & preprocessing
│   │   └── predict.py           #    Run inference on new videos
│   ├── requirements.txt         #    Python dependencies for ML
│   └── README.md
│
├── backend/                     # ⚙️ Backend API (FastAPI + Python)
│   ├── app/
│   │   ├── main.py              #    FastAPI entry point
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py      #    Login, Signup, OTP, Password Reset
│   │   │       ├── analysis.py  #    Video upload & gait analysis
│   │   │       ├── users.py     #    User profile management
│   │   │       └── history.py   #    Analysis history & records
│   │   ├── core/
│   │   │   ├── config.py        #    Environment & app config
│   │   │   ├── security.py      #    JWT tokens, password hashing
│   │   │   └── supabase_client.py  # Supabase connection
│   │   ├── services/
│   │   │   ├── auth_service.py  #    Auth business logic
│   │   │   ├── gait_service.py  #    ML model inference logic
│   │   │   └── email_service.py #    OTP email sending
│   │   └── models/
│   │       └── schemas.py       #    Pydantic request/response schemas
│   ├── requirements.txt         #    Python dependencies for backend
│   ├── .env.example             #    Environment variables template
│   └── README.md
│
├── frontend/                    # 🎨 Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            #    Auth-related components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── OTPVerification.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── dashboard/       #    Dashboard components
│   │   │   │   ├── DashboardHome.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── StatsCards.jsx
│   │   │   ├── analysis/        #    Gait analysis components
│   │   │   │   ├── VideoUpload.jsx
│   │   │   │   ├── AnalysisResult.jsx
│   │   │   │   └── AnalysisHistory.jsx
│   │   │   └── common/          #    Shared/reusable components
│   │   │       ├── Navbar.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/               #    Page-level components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/            #    API communication layer
│   │   │   ├── api.js           #    Axios instance & interceptors
│   │   │   ├── authService.js   #    Auth API calls
│   │   │   └── analysisService.js  # Analysis API calls
│   │   ├── hooks/               #    Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useAnalysis.js
│   │   ├── context/             #    React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── styles/              #    CSS stylesheets
│   │   │   ├── variables.css    #    Design tokens & CSS variables
│   │   │   ├── index.css        #    Global styles
│   │   │   ├── auth.css         #    Auth page styles
│   │   │   ├── dashboard.css    #    Dashboard styles
│   │   │   └── analysis.css     #    Analysis page styles
│   │   ├── assets/              #    Static assets (images, icons)
│   │   ├── App.jsx              #    Root component + routing
│   │   └── main.jsx             #    Vite entry point
│   └── README.md
│
├── Gait_Video/                  # 🎬 Raw training videos (existing)
│   ├── Person 1/
│   ├── Person 2/
│   └── Person 3/
│
├── *.pkl                        # Existing trained model artifacts
├── *.csv                        # Existing feature datasets
└── README.md                    # ← You are here
```

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| **ML Model**    | Python, MediaPipe, scikit-learn (SVM) |
| **Backend**     | FastAPI, Supabase (Auth + DB), Python |
| **Frontend**    | React 18, Vite, React Router          |
| **Database**    | Supabase (PostgreSQL)                 |
| **Auth**        | Supabase Auth (Email/Password + OTP)  |
| **Storage**     | Supabase Storage (video uploads)      |

## 🚀 Getting Started

> Detailed setup instructions will be added to each module's README.
