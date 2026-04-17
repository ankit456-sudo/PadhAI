import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useStudySocket = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [totalFocusedSeconds, setTotalFocusedSeconds] = useState(0);
  const [distractionCount, setDistractionCount] = useState(0);
  const [lastAlert, setLastAlert] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('session_started', () => {
      setTimerRunning(true);
      setTotalFocusedSeconds(0);
      setDistractionCount(0);
      setLastAlert(null);
      setSessionSummary(null);
    });

    socket.on('timer_paused', ({ reason, message, totalFocusedSeconds, distractionCount }) => {
      setTimerRunning(false);
      setTotalFocusedSeconds(totalFocusedSeconds);
      setDistractionCount(distractionCount);
      setLastAlert({ type: reason, message });
      // Play audio alert
      playAlert();
    });

    socket.on('timer_resumed', ({ totalFocusedSeconds }) => {
      setTimerRunning(true);
      setTotalFocusedSeconds(totalFocusedSeconds);
      setLastAlert(null);
    });

    socket.on('session_summary', (summary) => {
      setTimerRunning(false);
      setSessionSummary(summary);
    });

    return () => socket.disconnect();
  }, []);

  const startSession = useCallback((sessionId, userId) => {
    socketRef.current?.emit('start_session', { sessionId, userId });
  }, []);

  const reportDistraction = useCallback((sessionId, type) => {
    socketRef.current?.emit('distraction_detected', {
      sessionId,
      type,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const resumeSession = useCallback((sessionId) => {
    socketRef.current?.emit('resume_session', { sessionId });
  }, []);

  const endSession = useCallback((sessionId) => {
    socketRef.current?.emit('end_session', { sessionId });
  }, []);

  return {
    connected,
    timerRunning,
    totalFocusedSeconds,
    distractionCount,
    lastAlert,
    sessionSummary,
    startSession,
    reportDistraction,
    resumeSession,
    endSession,
  };
};

let audioCtx = null;

function playAlert() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const ctx = audioCtx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio alert failed:', e);
  }
}
