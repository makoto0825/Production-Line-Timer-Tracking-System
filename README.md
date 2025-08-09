# Production Line Timer Tracking System

## 📋 Project Overview

A timer tracking system for production lines. This full-stack web application enables workers to track the duration of a production process, enter defect counts, and manage extended work time after the scheduled duration has passed.

## 🛠️ Tech Stack
<img width="886" height="489" alt="image" src="https://github.com/user-attachments/assets/21257312-9ad9-4635-b5b4-5d35ec8d6ffc" />


### Frontend

- **React 19** + **TypeScript**
- **Vite** (High-speed build tool)
- **Tailwind CSS** (Utility-first CSS)
- **React Router DOM** (SPA routing)
- **SweetAlert2** (Modal UI)
- **Server-Sent Events** (Real-time communication)

### Backend

- **Node.js** + **Express** (RESTful API)
- **TypeScript**
- **MongoDB** + **Mongoose** (NoSQL database)
- **CORS** (Cross-origin support)

### DevOps

- **Render** (Production deployment)
- **MongoDB Atlas** (Cloud database)
- **Git** (Version control)

## 🎯 Main Features

### 🔐 Page 1: Login & Build Selection

- Authentication by Login ID and Build Number
- Automatically fetch and display build information from the database
- Record session start time
- Prevent duplicate login for the same user

### ⏱️ Page 2: Timer & Work Tracking

- **Real-time timer**: Dynamic countdown based on parts count × time per part
- **Pause function**: Exclude time during work interruption
- **Defect entry**: Save in real-time
- **Server time sync**: Accurate time management via Server-Sent Events

### 🚨 Overtime Management System

- **Smart popup**: Automatic modal display when the timer exceeds zero
- **Countdown function**: Configurable wait time (default 10 minutes)
- **Continuation confirmation**: YES/NO selection to decide whether to continue work
- **Auto-submit**: Automatic session submission if no response
- **Scheduling**: Repeat display based on active time
- **State persistence**: Handles page reloads and closures

### 📄 Page 3: Final Submission

- **Finished parts input**: Input field
- **Back function**: Return to timer page (with data retention)
- **Manual submit**: Send comprehensive session data

## 🗃️ Database Schema

### Sessions Collection

```javascript
{
  loginId: String,                    // Login ID
  buildNumber: String,                // Build Number
  numberOfParts: Number,               // Number of parts
  timePerPart: Number,                 // Time per part (minutes)
  startTime: Date,                     // Start time
  endTime: Date,                       // End time
  totalPausedTime: Number,             // Total paused time (seconds)
  totalParts: Number,                  // Finished parts count
  defects: Number,                     // Defects count
  pauseRecords: [{                     // Pause records
    start: Date,
    end: Date
  }],
  popupInteractions: [{                // Popup interaction history
    type: "YES|NO|AUTO_SUBMIT",
    timestamp: Date
  }],
  submissionType: "MANUAL|AUTO_SUBMIT", // Submission type
  totalActiveTimeSec: Number,          // Total active time
  totalInactiveTimeSec: Number,        // Total inactive time
  popupWaitAccumSec: Number            // Total popup wait time
}
```

### Builds Collection

```javascript
{
  buildNumber: String,     // Unique build number
  numberOfParts: Number,   // Number of parts
  timePerPart: Number      // Time per part (minutes)
}
```

### SessionLocks Collection

```javascript
{
  loginId: String,      // Unique login ID
  acquiredAt: Date,     // Lock acquisition time
  expiresAt: Date       // Expiration time (TTL)
}
```

## 📡 API Endpoints

### Build Management

- `GET /api/builds/validate/:buildNumber` - Validate build information

### Session Management

- `POST /api/sessions` - Submit session data

### Real-time Communication

- `GET /api/timer` - SSE server time stream

### Session Lock Management

- `POST /api/session-locks/acquire` - Acquire session lock
- `POST /api/session-locks/release` - Release session lock

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### 1. Clone Repository

```bash
git clone https://github.com/makoto0825/Production-Line-Timer-Tracking-System.git
cd Production-Line-Timer-Tracking-System
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Set Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://makoto:Makoto0825@cluster0.rx68s45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:5173
DEFAULT_LOCK_TTL_MINUTES=120
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_COUNTDOWN_DURATION=600
VITE_POPUP_INTERVAL=600
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

### 5. Start Application

#### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

### 6. Access in Browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production URLs

- **Frontend**: https://production-timer-frontend.onrender.com
- **Backend**: https://production-timer-backend.onrender.com

## 🏗️ Architecture Design

### Frontend Design

- **State Management**: React Hooks + localStorage for persistence
- **Real-time Communication**: Server-Sent Events (SSE) for server time sync
- **UI/UX**: Tailwind CSS + SweetAlert2 for consistent design

### Backend Design

- **RESTful API**: Standard REST API with Express.js
- **Real-time Communication**: SSE endpoint for time streaming
- **Database**: Flexible schema design with MongoDB + Mongoose
- **Session Management**: Exclusive control via SessionLock

### Security Measures

- **CORS Settings**: Restrict to appropriate origins
- **Input Validation**: Validation on both frontend and backend
- **Session Lock**: Prevent concurrent logins

## 🔧 Key Design Decisions

### 1. Session Persistence

State restoration using localStorage + server time sync

### 2. Time Management Accuracy

1-second interval server time streaming via SSE

### 3. Main Timer Counting

- **While paused**: Main timer stops and is not added to elapsed time
- **On page close**: If not paused, counting continues based on server time
- **On re-access**: Remaining time recalculated from server record and resumed

### 4. Overtime Counter

- **Start condition**: Begins counting when main timer passes 00:00:00
- **While paused**: Scheduling for next popup in 10 minutes is also paused
- **On page close**: If not paused, counting continues based on server time
- **On re-access**: Overtime recalculated from server record and resumed

### 5. Pause

- Paused time recorded as `totalPausedTime`
- Pause state preserved and pause screen shown even after re-access

### 6. Concurrent Session Control

**Issue**: Prevent multiple sessions for the same user  
**Solution**: MongoDB TTL index + unique constraint for SessionLock

## 📈 Performance Optimization

- **Frontend**: High-speed build & HMR with Vite
- **Backend**: Lightweight API with Express.js
- **Database**: Optimized MongoDB indexes
- **Communication**: Efficient real-time communication via SSE

