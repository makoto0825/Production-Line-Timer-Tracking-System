# Production Line Timer Tracking System

## 📋 Project Overview

This application is a full-stack web application designed to accurately measure and record production line working time.
It enables workers to manage the progress of the production process, record defect counts, and manage extended work when the scheduled time is exceeded.

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
<img width="1852" height="987" alt="image" src="https://github.com/user-attachments/assets/25ad020d-5c93-4abf-a2e8-1d84cfe04477" />


- Authentication by Login ID and Build Number
- Automatically fetch and display build information from the database
- Prevent duplicate login for the same user

### ⏱️ Page 2: Timer & Work Tracking
<img width="1716" height="963" alt="image" src="https://github.com/user-attachments/assets/38d6cf7f-ee57-4031-80bf-501d2c89ff1f" />

<img width="1167" height="946" alt="image" src="https://github.com/user-attachments/assets/a9d5caa4-bf52-49a0-9215-715b322dbda4" />

<img width="1310" height="982" alt="image" src="https://github.com/user-attachments/assets/94ea01de-0dd9-47ad-be81-d9e58cdd207b" />

- **Real-time timer**: Dynamic countdown based on parts count × time per part
- **Pause function**: Exclude time during work interruption
- **Defect entry**: Save in real-time
- **Server time sync**: Accurate time management via Server-Sent Events
- **Smart popup**: Automatic modal display when the timer exceeds zero
- **Countdown function**: Configurable wait time (default 10 minutes)
- **Continuation confirmation**: YES/NO selection to decide whether to continue work
- **Auto-submit**: Automatic session submission if no response
- **Scheduling**: Repeat display based on active time
- **State persistence**: Handles page reloads and closures

### 📄 Page 3: Final Submission
<img width="1627" height="967" alt="image" src="https://github.com/user-attachments/assets/49ccec9c-f7dc-4304-8eb9-a0ca97348315" />


- **Finished parts input**: Input field
- **Back function**: Return to timer page (with data retention)
- **Manual submit**: Send comprehensive session data

## 🧪 Testing Instructions
<img width="517" height="517" alt="image" src="https://github.com/user-attachments/assets/fdc5e89d-6837-4203-8876-bbb83ba00522" />

When testing the application:
Go to the Login page.

https://production-timer-frontend.onrender.com

Enter any value for Login ID (free input).
For Build Number, use one of the following test values:

- B00001
- B00002
- B00003
- B00004
- B00005
- B00006
- B00007

This data is pre-saved in the database.

<span style="color:red">**⚠️ Note:** The application is hosted on Render’s free plan, so the first backend connection during login may take a few minutes. Once the connection is established, subsequent requests will respond without delay.</span>


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
MONGODB_URI=　your mongoDB URI
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

