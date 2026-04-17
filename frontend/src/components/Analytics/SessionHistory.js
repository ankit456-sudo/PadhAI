import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/sessions?page=${page}&limit=${LIMIT}`)
      .then((res) => { setSessions(res.data.sessions || []); setTotal(res.data.total || 0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    await axios.delete(`/api/sessions/${id}`);
    setSessions((prev) => prev.filter((s) => s._id !== id));
    setTotal((t) => t - 1);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    return m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Session History</h1>
        <p className="page-sub">{total} total sessions recorded.</p>
      </div>

      {loading ? (
        <div className="loading">Loading history...</div>
      ) : sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <span style={{ fontSize: 48 }}>📭</span>
          <p style={{ color: '#94a3b8', marginTop: 12 }}>No sessions yet. Start your first study session!</p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3748', color: '#94a3b8', fontSize: 12 }}>
                {['Subject', 'Goal', 'Focused', 'Distractions', 'Score', 'Status', 'Date', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', paddingBottom: 12, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{s.subject}</td>
                  <td>{s.goalMinutes}m</td>
                  <td>{formatDuration(s.focusedSeconds)}</td>
                  <td>{s.distractions?.length || 0}</td>
                  <td>
                    <span className={`badge ${s.focusScore >= 70 ? 'badge-green' : s.focusScore >= 40 ? 'badge-yellow' : 'badge-red'}`}>
                      {s.focusScore}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.status === 'completed' ? 'badge-green' : s.status === 'in_progress' ? 'badge-purple' : 'badge-red'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(s.startedAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(s._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Prev</button>
              <span style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8' }}>Page {page} of {Math.ceil(total / LIMIT)}</span>
              <button className="btn btn-outline" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
