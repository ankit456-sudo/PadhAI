import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.name) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-layout">
      {/* LEFT PANEL */}
      <div className="landing-info">
        <h1 className="landing-title">
          Master Your Focus.<br/>
          <span className="text-gradient">Ace Your Exams.</span>
        </h1>
        <p className="landing-subtitle">
          PadhAI uses advanced AI and real-time monitoring to build your deep work habits. Minimize distractions, track your focus score, and take control of your study sessions.
        </p>

        <div className="landing-features">
          <div className="feature-item">
            <div className="feature-icon">📷</div>
            <div className="feature-content">
              <h4>AI-Powered Monitoring</h4>
              <p>Monitors your posture, presence, and phone usage locally in your browser using TensorFlow.js.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔔</div>
            <div className="feature-content">
              <h4>Real-time Distraction Alerts</h4>
              <p>Instant audio and visual feedback the moment you lose focus, synced via WebSockets.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h4>Deep Work Analytics</h4>
              <p>Track your focus score and study streaks. View your progress over days and weeks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card */}
      <div className="landing-auth">
        <div className="auth-card glass-card">
          <div className="auth-logo">Padh<span>AI</span></div>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, margin: '0 0 28px' }}>
            {isLogin ? 'Welcome back. Ready to focus?' : 'Join PadhAI and start forming habits.'}
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" placeholder="Ankit Yadav" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 12 }} disabled={loading}>
              {loading ? '⏳ Please wait...' : isLogin ? '🚀 Sign In' : '🎉 Create Account'}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
