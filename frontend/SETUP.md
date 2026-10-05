# Secure Gait Recognition Frontend - Setup Guide

## 📋 Overview

This is a production-ready React 18 frontend for the **Secure Gait Recognition System**, a biometric authentication application using gait analysis. The frontend includes a complete authentication pipeline with Supabase integration, a professional security command center dashboard, and a sophisticated video processing workflow.

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366F1) - Main interactive elements with glow effects
- **Accent**: Emerald (#10B981) - Success states and authorized indicators
- **Background**: Deep Charcoal (#0F0F0F) - Main background with layered depth
- **Secondary**: Slate (#64748B) - Secondary text and borders

### Visual Style
- **Glassmorphism**: Semi-transparent cards with backdrop blur effect
- **Cyber Aesthetic**: Neon glow effects on interactive elements
- **Smooth Animations**: Framer Motion for all transitions
- **Professional Icons**: Lucide React icon library

---

## 🔐 Authentication Flow

### Complete User Journey

```
Unauthenticated User
        ↓
    /login (LoginForm)
        ↓
  Email + Password ──→ Supabase Auth
        ↓
    /signup (SignupForm)
        ↓
  Full Name + Email + Password ──→ Supabase
        ↓
    /otp (OTPVerification)
        ↓
  6-Digit Code Verification
        ↓
    /forgot-password (ForgotPassword)
        ↓
  Password Reset Request ──→ Email Verification
        ↓
    /dashboard (DashboardPage)
        ↓
  Authenticated Dashboard
        ↓
    /analysis (AnalysisPage)
        ↓
  Video Upload → Analysis Loading → Results Display
```

### Services
- **AuthService** (`src/services/authService.js`)
  - `login(email, password)` - Email/password authentication
  - `signup(fullName, email, password)` - New account creation
  - `verifyOTP(email, otp)` - 6-digit code verification
  - `forgotPassword(email)` - Password reset initiation
  - `logout()` - Session termination

- **GaitService** (`src/services/gaitService.js`)
  - `uploadVideo(file)` - Upload video to Supabase storage
  - `analyzeGait(videoPath, metadata)` - ML analysis pipeline
  - `saveDetectionResult(result)` - Store result in database
  - `getDetectionHistory(limit)` - Fetch user's scan history
  - `getSystemStats()` - Aggregate dashboard statistics

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account and project setup
- React 18 with React Router v7

### Step 1: Install Dependencies
```bash
cd frontend
npm install
# OR
yarn install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the frontend directory based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

**Where to find these values:**
1. Go to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy the **Project URL** and **anon (public) key**

### Step 3: Run Development Server
```bash
npm run dev
# OR
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 4: Build for Production
```bash
npm run build
# OR
yarn build
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                          # Main router with AuthProvider
│   ├── main.jsx                         # Vite entry point
│   ├── style.css                        # Global styles
│   │
│   ├── styles/
│   │   ├── index.css                    # Core styles
│   │   ├── variables.css                # Design system (colors, shadows, gradients)
│   │   ├── auth.css                     # Auth pages styling
│   │   ├── dashboard.css                # Dashboard styling
│   │   └── analysis.css                 # Analysis workflow styling
│   │
│   ├── core/
│   │   ├── config.py                    # Configuration helpers
│   │   ├── security.py                  # Security utilities
│   │   └── supabase_client.js           # Supabase client + helpers
│   │
│   ├── context/
│   │   └── AuthContext.jsx              # Global auth state + Supabase integration
│   │
│   ├── services/
│   │   ├── api.js                       # HTTP client
│   │   ├── authService.js               # Authentication operations
│   │   ├── gaitService.js               # Gait analysis pipeline
│   │   └── analysisService.js           # Analysis API calls
│   │
│   ├── hooks/
│   │   └── useAuth.js                   # Custom hook for auth context
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx                # Login entry point
│   │   ├── SignupPage.jsx               # Registration flow
│   │   ├── ForgotPasswordPage.jsx       # Password recovery
│   │   ├── DashboardPage.jsx            # Main dashboard
│   │   ├── AnalysisPage.jsx             # Video processing pipeline
│   │   ├── HistoryPage.jsx              # Scan history
│   │   ├── ProfilePage.jsx              # User settings
│   │   └── NotFoundPage.jsx             # 404 error page
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx               # Top navigation bar
│   │   │   ├── LoadingSpinner.jsx       # Loading indicator
│   │   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx            # Email/password login
│   │   │   ├── SignupForm.jsx           # Multi-step registration
│   │   │   ├── OTPVerification.jsx      # 6-digit code entry
│   │   │   ├── ForgotPassword.jsx       # Password reset request
│   │   │   └── ResetPassword.jsx        # Password change form
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.jsx        # Placeholder dashboard
│   │   │   ├── SecurityDashboard.jsx    # Command center interface
│   │   │   ├── StatsCards.jsx           # Stats display
│   │   │   └── Sidebar.jsx              # Navigation sidebar
│   │   │
│   │   └── analysis/
│   │       ├── VideoUpload.jsx          # Drag-drop video upload
│   │       ├── GaitAnalysisLoading.jsx  # 4-stage progress animation
│   │       ├── AnalysisResult.jsx       # Results display with metrics
│   │       └── AnalysisHistory.jsx      # Historical scan results
│   │
│   └── assets/
│       └── (images, icons, etc.)
│
├── public/
│   └── (static assets)
│
├── .env.example                         # Environment variable template
├── .env                                 # Local environment (git-ignored)
├── package.json                         # Dependencies
├── vite.config.js                       # Vite configuration
├── tsconfig.json                        # TypeScript config (optional)
└── README.md
```

---

## 🔌 API Integration

The frontend communicates with two backends:

### 1. Supabase Backend
- **Auth**: User registration, login, email verification, password reset
- **Database**: Detection history, user profiles, analytics
- **Storage**: Video file uploads (buckets for gait videos)

### 2. Python Flask ML Backend
- **Endpoint**: `POST /api/analyze-gait`
- **Input**: Video file (MP4/AVI/MOV)
- **Output**: Gait analysis results with biometric metrics
- **Integration**: Via `gaitService.analyzeGait()` function

---

## 🎯 Core Features

### 1. Authentication
- ✅ Email/password login
- ✅ Account registration with email verification
- ✅ Email-based password reset
- ✅ 6-digit OTP verification
- ✅ Persistent session management
- ✅ Protected routes (ProtectedRoute wrapper)

### 2. Dashboard
- ✅ Security command center aesthetic
- ✅ Real-time statistics
  - Total scans performed
  - Last scan timestamp
  - Authorized users count
  - System status indicator
- ✅ Navigation to key features
- ✅ User logout functionality

### 3. Gait Analysis Pipeline
- ✅ **Video Upload**
  - Drag-and-drop interface
  - Format validation (MP4, AVI, MOV)
  - Size validation (max 100MB)
  - File preview with details

- ✅ **Analysis Loading**
  - 4-stage progress animation
  - Real-time progress indicator
  - Professional scanning effect
  - Progress tracker (Frame Extraction → MediaPipe → Skeletal Data → SVM)

- ✅ **Results Display**
  - Detected person identification
  - Confidence score (color-coded)
  - Biometric metrics grid
  - Download report functionality
  - Analyze another button

### 4. History & Analytics
- ✅ Scan history with filtering
- ✅ Confidence scores trending
- ✅ Success/failure statistics

### 5. User Profile
- ✅ Profile information editing
- ✅ Account settings
- ✅ Security preferences

---

## 🧪 Component Reference

### Authentication Components

#### LoginForm
```jsx
import LoginForm from './components/auth/LoginForm';

<LoginForm />
```
- Email/password inputs
- "Forgot password" link
- Loading state with spinner
- Error message display
- Redirects to dashboard on success

#### SignupForm
```jsx
import SignupForm from './components/auth/SignupForm';

<SignupForm />
```
- Step 1: Full name, email, password
- Step 2: OTP verification
- Password strength indicator
- Smooth step transitions

#### OTPVerification
```jsx
import OTPVerification from './components/auth/OTPVerification';

<OTPVerification email="user@example.com" />
```
- 6 individual input fields
- Auto-focus between fields
- Backspace/delete handling
- Paste functionality

### Dashboard Components

#### SecurityDashboard
```jsx
import SecurityDashboard from './components/dashboard/SecurityDashboard';

<SecurityDashboard />
```
- Command center interface
- 4-stat grid (users, scans, status, last scan)
- "Initialize Gait Scan" CTA button
- Navigation cards

### Analysis Components

#### VideoUpload
```jsx
import VideoUpload from './components/analysis/VideoUpload';

<VideoUpload 
  file={file}
  setFile={setFile}
  onStartAnalysis={handleStartAnalysis}
  isLoading={false}
/>
```

#### GaitAnalysisLoading
```jsx
import GaitAnalysisLoading from './components/analysis/GaitAnalysisLoading';

<GaitAnalysisLoading />
```
- Animated scanner effect
- 4-stage progress stages
- Progress percentage
- Step indicators

#### AnalysisResult
```jsx
import AnalysisResult from './components/analysis/AnalysisResult';

<AnalysisResult 
  result={result}
  onReset={handleReset}
  onDownload={handleDownloadReport}
/>
```

---

## 🔐 Supabase Database Schema

### Expected Tables

```sql
-- Users (managed by Supabase Auth)
-- Created automatically with email, password_hash, etc.

-- Detections
CREATE TABLE detections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  person_name TEXT,
  confidence FLOAT,
  avg_knee_angle FLOAT,
  avg_hip_angle FLOAT,
  stride_length FLOAT,
  step_count INT,
  video_uri TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Authorized Users (for comparison)
CREATE TABLE authorized_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  enrollment_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Vercel (Recommended for Next.js/React SPA)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🐛 Troubleshooting

### Issue: "Supabase client not initialized"
**Solution**: Ensure `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: "Protected route redirecting to login"
**Solution**: Check that `isAuthenticated` state is properly set by AuthContext

### Issue: "Video upload fails"
**Solution**: 
- Verify file format (MP4, AVI, or MOV)
- Ensure file size < 100MB
- Check Supabase storage bucket permissions

### Issue: "OTP verification fails"
**Solution**: Verify that Supabase email provider is configured in project settings

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Router v7](https://reactrouter.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 📧 Support

For issues or questions about the frontend:
1. Check the troubleshooting section above
2. Review Supabase console for auth/database issues
3. Check browser console for client-side errors
4. Verify environment variables are correctly set

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
