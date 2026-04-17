const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'PadhAI server running 🚀' }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ─────────────────────────────────────────────
// Socket.io — Real-time Study Session Management
// ─────────────────────────────────────────────
const activeSessions = {}; // sessionId → { userId, timerRunning, startTime, totalFocusedSeconds }

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Student starts a study session
  socket.on('start_session', ({ sessionId, userId }) => {
    activeSessions[sessionId] = {
      userId,
      socketId: socket.id,
      timerRunning: true,
      startTime: Date.now(),
      totalFocusedSeconds: 0,
      distractions: [],
    };
    socket.join(sessionId);
    socket.emit('session_started', { sessionId, message: 'Study session started. Focus mode ON 🎯' });
    console.log(`📚 Session started: ${sessionId} by user ${userId}`);
  });

  // AI detected a distraction on the client side
  socket.on('distraction_detected', ({ sessionId, type, timestamp }) => {
    const session = activeSessions[sessionId];
    if (!session) return;

    if (session.timerRunning) {
      // Pause the timer
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      session.totalFocusedSeconds += elapsed;
      session.timerRunning = false;
      session.startTime = null;

      // Log the distraction
      session.distractions.push({ type, timestamp: timestamp || new Date().toISOString() });

      // Notify client to pause timer and play alert
      io.to(sessionId).emit('timer_paused', {
        reason: type,
        message: getDistractionMessage(type),
        totalFocusedSeconds: session.totalFocusedSeconds,
        distractionCount: session.distractions.length,
      });
      console.log(`⚠️  Distraction [${type}] in session ${sessionId}`);
    }
  });

  // Student resumes after fixing distraction
  socket.on('resume_session', ({ sessionId }) => {
    const session = activeSessions[sessionId];
    if (!session || session.timerRunning) return;

    session.timerRunning = true;
    session.startTime = Date.now();

    io.to(sessionId).emit('timer_resumed', {
      message: 'Great! Focus mode resumed. You got this! 💪',
      totalFocusedSeconds: session.totalFocusedSeconds,
    });
    console.log(`▶️  Session resumed: ${sessionId}`);
  });

  // Student ends the session
  socket.on('end_session', ({ sessionId }) => {
    const session = activeSessions[sessionId];
    if (!session) return;

    let finalFocusedSeconds = session.totalFocusedSeconds;
    if (session.timerRunning && session.startTime) {
      finalFocusedSeconds += Math.floor((Date.now() - session.startTime) / 1000);
    }

    const summary = {
      totalFocusedSeconds: finalFocusedSeconds,
      distractionCount: session.distractions.length,
      distractions: session.distractions,
      focusScore: calculateFocusScore(finalFocusedSeconds, session.distractions.length),
    };

    socket.emit('session_summary', summary);
    delete activeSessions[sessionId];
    console.log(`🏁 Session ended: ${sessionId}`, summary);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Helpers
function getDistractionMessage(type) {
  const messages = {
    phone_detected: '📱 Phone detected! Put it away and stay focused.',
    face_away: '👀 You looked away! Come back to your books.',
    talking: '🗣️  Talking detected! Silence is golden during study.',
    absent: '🚫 You left the study area! Please come back.',
    multiple_people: '👥 Multiple people detected! Study solo for best results.',
  };
  return messages[type] || '⚠️ Distraction detected! Refocus now.';
}

function calculateFocusScore(focusedSeconds, distractionCount) {
  const focusMinutes = focusedSeconds / 60;
  const penalty = distractionCount * 5;
  const raw = Math.max(0, focusMinutes - penalty);
  return Math.min(100, Math.round((raw / Math.max(focusMinutes, 1)) * 100));
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 PadhAI server running on port ${PORT}`));
