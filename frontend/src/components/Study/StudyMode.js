import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useStudySocket } from '../../hooks/useStudySocket';
import { useDistractionDetection } from '../../hooks/useDistractionDetection';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography', 'Economics', 'Other'];

const PHASE = { SETUP: 'setup', ACTIVE: 'active', PAUSED: 'paused', DONE: 'done' };

export default function StudyMode() {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const localTimerRef = useRef(null);

  const [phase, setPhase] = useState(PHASE.SETUP);
  const [form, setForm] = useState({ subject: 'Mathematics', goalMinutes: 25 });
  const [sessionId, setSessionId] = useState(null);
  const [localSeconds, setLocalSeconds] = useState(0);
  const [error, setError] = useState('');
  const [camError, setCamError] = useState('');
  const [distractionLog, setDistractionLog] = useState([]);

  const socket = useStudySocket();

  // Distraction callback — only fire once every 8 seconds to avoid spam
  const lastDistractionRef = useRef(0);
  const handleDistraction = useCallback(({ type }) => {
    const now = Date.now();
    if (now - lastDistractionRef.current < 3000) return;
    lastDistractionRef.current = now;
    if (phase !== PHASE.ACTIVE) return;
    socket.reportDistraction(sessionId, type);
    setDistractionLog((prev) => [{ type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
  }, [phase, sessionId, socket]);

  const { modelLoaded, startDetection, stopDetection } = useDistractionDetection({
    enabled: phase === PHASE.ACTIVE || phase === PHASE.PAUSED,
    onDistraction: handleDistraction,
  });

  // Sync phase with socket events
  useEffect(() => {
    if (socket.timerRunning && phase === PHASE.PAUSED) setPhase(PHASE.ACTIVE);
    if (!socket.timerRunning && phase === PHASE.ACTIVE && socket.lastAlert) setPhase(PHASE.PAUSED);
  }, [socket.timerRunning, socket.lastAlert]);

  useEffect(() => {
    if (socket.sessionSummary) setPhase(PHASE.DONE);
  }, [socket.sessionSummary]);

  // Local running timer for display
  useEffect(() => {
    if (phase === PHASE.ACTIVE) {
      localTimerRef.current = setInterval(() => setLocalSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(localTimerRef.current);
    }
    return () => clearInterval(localTimerRef.current);
  }, [phase]);

  // Reset local timer on pause
  useEffect(() => {
    if (phase === PHASE.PAUSED) setLocalSeconds(0);
  }, [phase]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.warn('Video play error:', e));
        };
      }
      return true;
    } catch (err) {
      setCamError('Camera access denied. AI monitoring will be disabled.');
      return false;
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleStart = async () => {
    setError('');
    try {
      const res = await axios.post('/api/sessions', {
        subject: form.subject,
        goalMinutes: Number(form.goalMinutes),
      });
      const sid = res.data._id;
      setSessionId(sid);
      await startCamera();
      socket.startSession(sid, user._id);
      setPhase(PHASE.ACTIVE);
      // startDetection ab async hai (mic permission bhi maangta hai)
      if (videoRef.current) await startDetection(videoRef.current);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session.');
    }
  };

  const handleResume = () => {
    socket.resumeSession(sessionId);
  };

  const handleEnd = async () => {
    stopDetection();
    socket.endSession(sessionId);
    stopCamera();
    // Save to DB
    try {
      await axios.put(`/api/sessions/${sessionId}/complete`, {
        focusedSeconds: socket.totalFocusedSeconds,
        distractions: distractionLog.map((d) => ({ type: d.type, timestamp: new Date().toISOString() })),
        focusScore: socket.sessionSummary?.focusScore || 0,
      });
    } catch (e) { /* non-critical */ }
  };

  const handleReset = () => {
    stopCamera();
    stopDetection();
    setPhase(PHASE.SETUP);
    setSessionId(null);
    setLocalSeconds(0);
    setDistractionLog([]);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalDisplay = socket.totalFocusedSeconds + (phase === PHASE.ACTIVE ? localSeconds : 0);

  // ── SETUP PHASE ──
  if (phase === PHASE.SETUP) return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎯 Start Study Session</h1>
        <p className="page-sub">Set your subject and goal. AI will keep you accountable.</p>
      </div>
      <div style={{ maxWidth: 480 }} className="card">
        {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Subject</label>
          <select className="form-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Goal Duration (minutes)</label>
          <input className="form-input" type="number" min={5} max={180} value={form.goalMinutes}
            onChange={(e) => setForm({ ...form, goalMinutes: e.target.value })} />
        </div>
        <div style={{ background: 'rgba(108,99,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#a78bfa', border: '1px solid rgba(108,99,255,0.2)' }}>
          🤖 AI will monitor your webcam for distractions: phone usage, looking away, talking, or leaving the frame. Timer pauses automatically!
        </div>
        <button className="btn btn-primary btn-lg btn-full" onClick={handleStart}>
          🚀 Begin Focus Session
        </button>
      </div>
    </div>
  );

  // ── DONE PHASE ──
  if (phase === PHASE.DONE && socket.sessionSummary) {
    const { totalFocusedSeconds, distractionCount, focusScore } = socket.sessionSummary;
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">🏁 Session Complete!</h1>
          <p className="page-sub">Great work. Here's your deep work report.</p>
        </div>
        <div className="card-grid card-grid-3" style={{ marginBottom: 24 }}>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="stat-label">Focused Time</span>
            <span className="stat-value stat-purple">{formatTime(totalFocusedSeconds)}</span>
          </div>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="stat-label">Focus Score</span>
            <span className={`stat-value ${focusScore >= 70 ? 'stat-green' : focusScore >= 40 ? 'stat-yellow' : 'stat-red'}`}>{focusScore}%</span>
          </div>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="stat-label">Distractions</span>
            <span className="stat-value stat-red">{distractionCount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary btn-lg" onClick={handleReset}>📚 New Session</button>
          <button className="btn btn-outline btn-lg" onClick={() => window.location.href = '/analytics'}>📊 View Analytics</button>
        </div>
      </div>
    );
  }

  // ── ACTIVE / PAUSED PHASE ──
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {phase === PHASE.ACTIVE ? '🟢 Studying — ' : '🔴 Paused — '}{form.subject}
        </h1>
        <p className="page-sub">Goal: {form.goalMinutes} minutes · AI monitoring {modelLoaded ? '✅ active' : '⏳ loading...'}</p>
      </div>

      {/* Distraction Alert */}
      {phase === PHASE.PAUSED && socket.lastAlert && (
        <div className="alert-banner">
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', color: '#ef4444' }}>Distraction Detected!</strong>
            <span style={{ fontSize: 13, color: '#fca5a5' }}>{socket.lastAlert.message}</span>
          </div>
          <button className="btn btn-success" style={{ marginLeft: 'auto' }} onClick={handleResume}>
            ▶️ I'm Back — Resume
          </button>
        </div>
      )}

      <div className="card-grid card-grid-2" style={{ marginBottom: 24 }}>
        {/* Webcam Feed */}
        <div className="card">
          <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>📸 AI Monitoring Feed</h3>
          {camError && <p style={{ color: '#f59e0b', fontSize: 13, marginBottom: 8 }}>{camError}</p>}
          <div className="webcam-container" style={{ background: '#0f0f1a' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 12, minHeight: 200 }} />
            <div className="webcam-overlay">
              <span className={`badge ${phase === PHASE.ACTIVE ? 'badge-green' : 'badge-red'}`}>
                {phase === PHASE.ACTIVE ? '● LIVE' : '⏸ PAUSED'}
              </span>
              {modelLoaded && <span className="badge badge-purple">🤖 AI ON</span>}
            </div>
          </div>
        </div>

        {/* Timer + Stats */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>TOTAL FOCUSED TIME</p>
            <div className={`timer-display ${phase === PHASE.PAUSED ? 'paused' : ''}`}>
              {formatTime(totalDisplay)}
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
              Goal: {formatTime(form.goalMinutes * 60)} · {Math.round((totalDisplay / (form.goalMinutes * 60)) * 100)}% done
            </p>
          </div>
          <div className="card-grid card-grid-2" style={{ gap: 12 }}>
            <div style={{ background: '#0f0f1a', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>DISTRACTIONS</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{socket.distractionCount}</p>
            </div>
            <div style={{ background: '#0f0f1a', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>STATUS</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: phase === PHASE.ACTIVE ? '#10b981' : '#ef4444' }}>
                {phase === PHASE.ACTIVE ? 'FOCUSED' : 'PAUSED'}
              </p>
            </div>
          </div>
          <button className="btn btn-danger btn-full" onClick={handleEnd}>
            ⏹ End Session
          </button>
        </div>
      </div>

      {/* Distraction Log */}
      {distractionLog.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>📋 Distraction Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
            {distractionLog.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
                <span>⚠️ {d.type.replace(/_/g, ' ')}</span>
                <span style={{ color: '#94a3b8' }}>{d.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
