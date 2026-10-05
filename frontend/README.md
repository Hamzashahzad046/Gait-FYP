# 🔐 Secure Gait Recognition Frontend

A production-grade React application for biometric authentication using gait analysis. Features a professional cybersecurity aesthetic with complete Supabase integration and sophisticated video processing pipeline.

## ✨ Features

### 🔐 Authentication System
- Email/password login and registration
- Email-based OTP verification (6-digit codes)
- Password recovery with email reset
- Persistent session management with Supabase
- Protected routes for authenticated users
- Real-time auth state management

### 🛡️ Security Command Center Dashboard
- Professional security operations aesthetic
- Real-time statistics and metrics
- Quick access to gait analysis feature
- System status indicators
- Navigation to personnel, logs, and settings

### 📹 Video Processing Pipeline
**Complete workflow from upload to biometric analysis:**

1. **Video Upload**
   - Drag-and-drop interface with click-to-browse
   - Format validation (MP4, AVI, MOV)
   - File size validation (max 100MB)
   - Real-time error feedback
   - File preview before analysis

2. **Analysis Processing**
   - Professional 4-stage progress animation
   - Real-time progress tracking
   - Scanning effect with visual indicators
   - Processing stages: Frame Extraction → MediaPipe Pose → Skeletal Data → SVM Classification

3. **Results Display**
   - Identified person with avatar
   - Confidence scoring (color-coded: red <70%, yellow 70-89%, green ≥90%)
   - Biometric metrics grid
   - Timestamp of analysis
   - Download report functionality
   - Quick re-analysis button

### 📊 Analytics & History
- Scan history with detailed records
- Detection confidence trends
- Success/failure statistics
- Historical analysis access

## 🎨 Design System

### Colors
- **Indigo** (#6366F1) - Primary interactive elements with glow effects
- **Emerald** (#10B981) - Success states and authorized indicators
- **Deep Charcoal** (#0F0F0F) - Main background with layered depth
- **Slate** (#64748B) - Secondary text and borders

### Visual Effects
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Glow Effects**: Neon-style highlighting on interactive elements
- **Smooth Animations**: Framer Motion transitions throughout
- **Professional Icons**: Lucide React icon library

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account with project
- Python Flask backend running (for ML analysis)

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

Get these from your [Supabase project settings](https://app.supabase.com).

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable UI components
│   ├── services/           # API and business logic
│   ├── context/            # State management (Auth)
│   ├── styles/             # CSS and design system
│   ├── hooks/              # Custom React hooks
│   └── core/               # Core utilities
├── public/                 # Static assets
├── .env.example            # Environment template
└── package.json            # Dependencies
```

## 🛠️ Technology Stack

- **Framework**: React 18 with React Router v7
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase File Storage
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## 📋 Authentication Flow

```
1. User navigates to /login
   ↓
2. Enter email/password → Supabase Auth
   ↓
3. Navigate to /signup (if new user)
   ↓
4. Enter full name, email, password
   ↓
5. Verify email with OTP (/otp)
   ↓
6. Redirected to /dashboard (authenticated)
   ↓
7. Access /analysis for video processing
```

## 🎯 Core Services

### AuthService
Handles all authentication operations:
- `login(email, password)` - User login
- `signup(fullName, email, password)` - New account creation
- `verifyOTP(email, otp)` - Email verification
- `forgotPassword(email)` - Password reset request
- `logout()` - Session termination

### GaitService
Manages gait analysis pipeline:
- `uploadVideo(file)` - Upload to Supabase Storage
- `analyzeGait(videoPath)` - Call ML backend analysis
- `saveDetectionResult(result)` - Store in database
- `getDetectionHistory(limit)` - Fetch user's scans
- `getSystemStats()` - Get dashboard metrics

## 🔐 Protected Routes

The following routes require authentication:
- `/dashboard` - Main dashboard
- `/analysis` - Video upload and analysis
- `/history` - Scan history
- `/profile` - Account settings

Public routes:
- `/login` - User login
- `/signup` - Registration
- `/forgot-password` - Password recovery

## 🧪 Testing

Run development server with hot reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📊 Performance

- Optimized with Vite for fast development
- Code splitting for faster page loads
- Lazy-loaded routes with React Router
- Optimized animations with Framer Motion
- Efficient state management with React Context

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Automatic deployment from GitHub
# Set environment variables in Vercel dashboard
# Connected to your git repository
```

### Netlify
```bash
# Build: npm run build
# Publish directory: dist
# Add environment variables
```

### Docker
```bash
docker build -t gait-frontend .
docker run -p 3000:3000 gait-frontend
```

## 🐛 Troubleshooting

### Issue: "Auth state not updating"
- Verify Supabase credentials in `.env`
- Check browser console for errors
- Ensure Supabase project is active

### Issue: "Video upload fails"
- Check file format (must be MP4, AVI, or MOV)
- Verify file size < 100MB
- Ensure Supabase storage bucket exists

### Issue: "OTP verification not working"
- Verify Supabase email provider is configured
- Check email spam folder for verification code

### Issue: "Protected routes redirecting to login"
- Clear browser localStorage
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in .env

## 📚 Documentation

- [Setting up Supabase](./SETUP.md)
- [Component Reference](./COMPONENTS.md)
- [API Integration Guide](./API.md)

## 📝 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Supabase console for auth/database issues
4. Verify all environment variables are set correctly

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: October 2024
