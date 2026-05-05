# 🎓 PadhAI — Every Focused Minute Counts

> AI-powered study accountability app built with MERN Stack + TensorFlow.js + Socket.io

**Group No:** G-52 | **Course:** MCA | **Session:** 2025-26  
**Supervisor:** Mr. Mohd. Shavez | **GLA University, Mathura**

---

## 👥 Team Members

| # | Name | Roll No. |
|---|------|----------|
| 1 | Ankit Yadav | 12584200030 |
| 2 | Ankit Saini | 12584200028 |
| 3 | Shivam Chaudhary | 12584200175 |
| 4 | Vanshika Goyal | 12584200203 |
| 5 | Varchasv Pratap | 12584200205 |

---

## 🚀 Features

- **Virtual Study Mode** — AI monitors webcam in real-time using TensorFlow.js (COCO-SSD)
- **Distraction Detection** — Detects phone usage, looking away, talking, being absent, multiple people
- **Real-time Timer Control** — Socket.io pauses/resumes timer instantly on distraction
- **Audio Alerts** — Web Audio API beep plays when distraction detected
- **Deep Work Analytics** — Weekly trends, subject breakdown, distraction pie chart
- **Focus Score** — Calculated based on focused time vs distraction frequency
- **Session History** — Full log of all study sessions with pagination
- **Streak Tracking** — Daily study streak to build habits
- **JWT Authentication** — Secure login/register system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| AI/CV | TensorFlow.js, COCO-SSD |
| Charts | Recharts |
| Auth | JWT + bcryptjs |

---

## 📁 Project Structure

```
padhai/
├── backend/
│   ├── models/
│   │   ├── User.js            # User schema with streak tracking
│   │   └── StudySession.js    # Session schema with distraction log
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Profile
│   │   ├── sessions.js        # CRUD for study sessions
│   │   └── analytics.js      # Summary, Weekly, Subjects
│   ├── middleware/
│   │   └── auth.js            # JWT protection middleware
│   ├── server.js              # Express + Socket.io server
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Auth/AuthPage.js         # Login / Register
        │   ├── Dashboard/
        │   │   ├── Layout.js            # Sidebar + nav
        │   │   └── Dashboard.js         # Home with charts
        │   ├── Study/StudyMode.js       # Core AI study page
        │   └── Analytics/
        │       ├── Analytics.js         # Charts & insights
        │       └── SessionHistory.js    # Session table
        ├── context/AuthContext.js       # Auth state management
        ├── hooks/
        │   ├── useStudySocket.js        # Socket.io hook
        │   └── useDistractionDetection.js  # TensorFlow.js hook
        └── index.css                   # Global dark-theme styles
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone / Extract the project
```bash
cd padhai
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy env file and fill in values
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm run dev      # Development with nodemon
# or
npm start        # Production
```

Backend runs on: **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

### 4. Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/padhai
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Sessions
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/sessions | Create session |
| GET | /api/sessions | Get all sessions |
| PUT | /api/sessions/:id/complete | Complete session |
| DELETE | /api/sessions/:id | Delete session |

### Analytics
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/analytics/summary | Overall stats |
| GET | /api/analytics/weekly | 7-day breakdown |
| GET | /api/analytics/subjects | Per-subject stats |

### Socket.io Events
| Event | Direction | Description |
|-------|-----------|-------------|
| start_session | client → server | Begin study session |
| distraction_detected | client → server | Report AI distraction |
| resume_session | client → server | Resume after fix |
| end_session | client → server | End session |
| timer_paused | server → client | Pause timer + alert |
| timer_resumed | server → client | Resume confirmed |
| session_summary | server → client | Final results |

---

## 🤖 How AI Detection Works

1. Browser loads **TensorFlow.js COCO-SSD** model (lite_mobilenet_v2)
2. Every **1.5 seconds**, the model runs inference on the webcam frame
3. Detections are classified:
   - `absent` — no person in frame
   - `phone_detected` — cell phone object detected
   - `multiple_people` — more than 1 person
   - `face_away` — person detected but face not visible
4. On distraction → Socket.io event sent to server → Timer paused → Audio beep plays
5. Student clicks "I'm Back" → session resumes

---

## 📊 Focus Score Formula

```
focusMinutes = totalFocusedSeconds / 60
penalty = distractionCount × 5
adjustedFocus = max(0, focusMinutes - penalty)
focusScore = min(100, round((adjustedFocus / focusMinutes) × 100))
```

---

*Built with ❤️ by Group G-52, MCA 2025-26, GLA University*
