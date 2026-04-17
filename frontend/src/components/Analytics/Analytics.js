import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

const COLORS = ['#6c63ff', '#10b981', '#f59e0b', '#ef4444', '#a78bfa'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics/summary'),
      axios.get('/api/analytics/weekly'),
      axios.get('/api/analytics/subjects'),
    ])
      .then(([s, w, sub]) => {
        setSummary(s.data);
        setWeekly(w.data.map((d) => ({ ...d, day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) })));
        setSubjects(sub.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;

  const distractionData = summary?.distractionBreakdown
    ? Object.entries(summary.distractionBreakdown).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
    : [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Deep Work Analytics</h1>
        <p className="page-sub">Track your focus patterns and study consistency.</p>
      </div>

      {/* Summary Stats */}
      <div className="card-grid card-grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-label">Total Focused Hours</span>
          <span className="stat-value stat-purple">{Math.floor((summary?.totalFocusedMinutes || 0) / 60)}h {(summary?.totalFocusedMinutes || 0) % 60}m</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions Completed</span>
          <span className="stat-value stat-green">{summary?.totalSessions || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Focus Score</span>
          <span className="stat-value stat-yellow">{summary?.avgFocusScore || 0}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Distractions</span>
          <span className="stat-value stat-red">{summary?.totalDistractions || 0}</span>
        </div>
      </div>

      {/* Weekly Focus Line Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>📈 7-Day Focus Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d3748', borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="focusedMinutes" stroke="#6c63ff" strokeWidth={2.5} dot={{ r: 4 }} name="Focused (min)" />
            <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Avg Score (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-grid card-grid-2" style={{ marginBottom: 24 }}>
        {/* Subject Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>📚 Study by Subject (minutes)</h3>
          {subjects.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No data yet. Complete some sessions!</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjects.map((s) => ({ name: s._id, minutes: Math.floor(s.totalMinutes), score: Math.round(s.avgScore) }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d3748', borderRadius: 8 }} />
                <Bar dataKey="minutes" fill="#6c63ff" radius={[0, 6, 6, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distraction Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>⚠️ Distraction Breakdown</h3>
          {distractionData.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#94a3b8', gap: 8 }}>
              <span style={{ fontSize: 36 }}>🎉</span>
              <p style={{ fontSize: 14 }}>No distractions logged yet!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={distractionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {distractionData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d3748', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Best Session Card */}
      {summary?.bestSession && (
        <div className="card" style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#10b981' }}>🏆 Best Session</h3>
          <div style={{ display: 'flex', gap: 32 }}>
            <div><p style={{ fontSize: 12, color: '#94a3b8' }}>Subject</p><p style={{ fontWeight: 600 }}>{summary.bestSession.subject}</p></div>
            <div><p style={{ fontSize: 12, color: '#94a3b8' }}>Focus Score</p><p style={{ fontWeight: 700, color: '#10b981', fontSize: 20 }}>{summary.bestSession.focusScore}%</p></div>
            <div><p style={{ fontSize: 12, color: '#94a3b8' }}>Date</p><p style={{ fontWeight: 600 }}>{new Date(summary.bestSession.date).toLocaleDateString()}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
