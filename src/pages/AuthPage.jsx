import { useState } from "react";

export default function AuthPage({ onLogin, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handle = () => onLogin({ name: form.name || "Ankit Yadav", email: form.email });

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "12px 16px", color: "#E8E8F0", fontSize: "14px",
    outline: "none", boxSizing: "border-box", fontFamily: "'Sora', sans-serif"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(120,80,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "420px", margin: "2rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "2.5rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#555566", cursor: "pointer", fontSize: "13px", marginBottom: "1.5rem", padding: 0 }}>← Back</button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "14px", background: "linear-gradient(135deg, #7850FF, #C062FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "22px", margin: "0 auto 1rem" }}>P</div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p style={{ margin: "0.5rem 0 0", color: "#666677", fontSize: "13px" }}>PadhAI · Smart Study Tracker</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {mode === "signup" && (
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          )}
          <input placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />

          <button onClick={handle} style={{
            marginTop: "0.5rem", background: "linear-gradient(135deg, #7850FF, #C062FF)",
            border: "none", color: "#fff", borderRadius: "10px", padding: "13px",
            cursor: "pointer", fontSize: "15px", fontWeight: 600, fontFamily: "'Sora', sans-serif"
          }}>{mode === "login" ? "Sign In" : "Create Account"}</button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "13px", color: "#555566" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#C062FF", cursor: "pointer" }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
