export default function LandingPage({ onGetStarted }) {
  const features = [
    { icon: "👁", title: "AI Vision Monitor", desc: "TensorFlow.js detects distractions via your webcam in real-time" },
    { icon: "⏱", title: "Smart Timer", desc: "Study timer auto-pauses on distraction via Socket.io signals" },
    { icon: "📊", title: "Deep Work Analysis", desc: "MongoDB logs every session for genuine focus analytics" },
    { icon: "🔔", title: "Instant Alerts", desc: "Audio + visual alerts the moment you lose focus" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'Sora', sans-serif", color: "#E8E8F0", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      {/* Glow blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(120,80,255,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "0", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(192,98,255,0.08) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(120,80,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #7850FF, #C062FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>P</div>
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em" }}>PadhAI</span>
        </div>
        <button onClick={onGetStarted} style={{
          background: "linear-gradient(135deg, #7850FF, #C062FF)",
          border: "none", color: "#fff", borderRadius: "10px",
          padding: "10px 24px", cursor: "pointer", fontSize: "14px", fontWeight: 600
        }}>Get Started →</button>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "7rem 2rem 5rem" }}>
        <div style={{
          display: "inline-block", background: "rgba(120,80,255,0.1)",
          border: "1px solid rgba(120,80,255,0.25)", borderRadius: "100px",
          padding: "6px 18px", fontSize: "12px", color: "#C062FF",
          letterSpacing: "0.08em", fontWeight: 600, marginBottom: "2rem", textTransform: "uppercase"
        }}>MCA Project · GLA University · 2025-26</div>

        <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", margin: "0 0 1.5rem" }}>
          Every focused<br />
          <span style={{ background: "linear-gradient(135deg, #7850FF, #C062FF, #FF62B0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            minute counts.
          </span>
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#888899", maxWidth: "540px", margin: "0 auto 3rem", lineHeight: 1.7, fontWeight: 300 }}>
          AI-powered study accountability. Real-time distraction detection. Honest deep work analytics. Stop pretending to study.
        </p>

        <button onClick={onGetStarted} style={{
          background: "linear-gradient(135deg, #7850FF, #C062FF)",
          border: "none", color: "#fff", borderRadius: "14px",
          padding: "16px 40px", cursor: "pointer", fontSize: "16px", fontWeight: 600,
          boxShadow: "0 0 40px rgba(120,80,255,0.3)"
        }}>Start Studying Now</button>
      </div>

      {/* Features */}
      <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "1.5rem"
          }}>
            <div style={{ fontSize: "28px", marginBottom: "0.75rem" }}>{f.icon}</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "0.5rem", color: "#E8E8F0" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: "#666677", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem 4rem" }}>
        <div style={{ fontSize: "12px", color: "#555566", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Built with</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {["MongoDB", "Express.js", "React", "Node.js", "TensorFlow.js", "Socket.io"].map(t => (
            <span key={t} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: "#888899", fontFamily: "'JetBrains Mono', monospace"
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
