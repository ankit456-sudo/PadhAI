import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics/summary'),
      axios.get('/api/analytics/weekly'),
      axios.get('/api/sessions?limit=5'),
    ])
      .then(([s, w, sess]) => {
        setSummary(s.data);
        setWeekly(w.data.map((d) => ({ ...d, day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) })));
        setRecentSessions(sess.data.sessions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const hrs = Math.floor((summary?.totalFocusedMinutes || 0) / 60);
  const mins = (summary?.totalFocusedMinutes || 0) % 60;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="page-sub">Here's your focus report. Keep the streak alive! 🔥</p>
      </div>

      {/* Stats Row */}
      <div className="card-grid card-grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-label">Total Study Time</span>
          <span className="stat-value stat-purple">{hrs}h {mins}m</span>
          <span className="stat-sub">All time focused</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions Done</span>
          <span className="stat-value stat-green">{summary?.totalSessions || 0}</span>
          <span className="stat-sub">Completed sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Focus Score</span>
          <span className="stat-value stat-yellow">{summary?.avgFocusScore || 0}%</span>
          <span className="stat-sub">Deep work quality</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value stat-red">🔥 {user?.streak || 0}</span>
          <span className="stat-sub">Days in a row</span>
        </div>
      </div>

      {/* Chart + Quick Start */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>📈 Weekly Focus (minutes)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="focusedMinutes" fill="#6c63ff" radius={[6, 6, 0, 0]} name="Focused (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>🚀 Quick Start</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>📚</div>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Ready to deep work? Start a focused study session now with AI accountability.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/study')}>
              🎯 Start Study Session
            </button>
          </div>
          {summary?.bestSession && (
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>🏆 Best session</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{summary.bestSession.subject} — {summary.bestSession.focusScore}% score</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>🕐 Recent Sessions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3748', color: '#94a3b8', fontSize: 12 }}>
                <th style={{ textAlign: 'left', paddingBottom: 10, fontWeight: 500 }}>Subject</th>
                <th style={{ textAlign: 'left', paddingBottom: 10, fontWeight: 500 }}>Focused</th>
                <th style={{ textAlign: 'left', paddingBottom: 10, fontWeight: 500 }}>Score</th>
                <th style={{ textAlign: 'left', paddingBottom: 10, fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px 0' }}>{s.subject}</td>
                  <td>{Math.floor(s.focusedSeconds / 60)} min</td>
                  <td>
                    <span className={`badge ${s.focusScore >= 70 ? 'badge-green' : s.focusScore >= 40 ? 'badge-yellow' : 'badge-red'}`}>
                      {s.focusScore}%
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(s.startedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
