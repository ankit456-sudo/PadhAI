export default function Dashboard({ onStartStudy, onViewAnalytics }) {
  const stats = [
    { label: "Today's Focus", value: "2h 34m", sub: "+18% vs yesterday", color: "#7850FF" },
    { label: "Focus Score", value: "87%", sub: "Excellent", color: "#00C896" },
    { label: "Sessions", value: "4", sub: "This week", color: "#C062FF" },
    { label: "Distractions", value: "6", sub: "All time today", color: "#FF6B6B" },
  ];

  const sessions = [
    { subject: "Data Structures", duration: "45m", score: 94, time: "09:15 AM", distractions: 1 },
    { subject: "DBMS", duration: "38m", score: 81, time: "11:00 AM", distractions: 3 },
    { subject: "Computer Networks", duration: "52m", score: 88, time: "02:30 PM", distractions: 2 },
    { subject: "OS Concepts", duration: "19m", score: 72, time: "04:45 PM", distractions: 0 },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em" }}>Good morning 👋</h1>
          <p style={{ margin: "0.4rem 0 0", color: "#666677", fontSize: "14px" }}>Ready to build deep focus today?</p>
        </div>
        <button onClick={onStartStudy} style={{
          background: "linear-gradient(135deg, #7850FF, #C062FF)",
          border: "none", color: "#fff", borderRadius: "12px",
          padding: "14px 28px", cursor: "pointer", fontSize: "15px",
          fontWeight: 600, fontFamily: "'Sora', sans-serif",
          boxShadow: "0 0 30px rgba(120,80,255,0.3)"
        }}>▶ Start Study Mode</button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "1.25rem", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ fontSize: "12px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{s.label}</div>
            <div style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", color: "#E8E8F0" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: s.color, marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Session History */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>Today's Sessions</h3>
          <button onClick={onViewAnalytics} style={{
            background: "rgba(120,80,255,0.1)", border: "1px solid rgba(120,80,255,0.2)",
            color: "#C062FF", borderRadius: "8px", padding: "6px 14px",
            cursor: "pointer", fontSize: "12px", fontFamily: "'Sora', sans-serif"
          }}>View Analytics →</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {sessions.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)", borderRadius: "10px", padding: "1rem 1.25rem",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: `rgba(120,80,255,0.15)`, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "16px"
                }}>📚</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{s.subject}</div>
                  <div style={{ fontSize: "12px", color: "#555566" }}>{s.time} · {s.duration}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#555566" }}>Distractions</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: s.distractions === 0 ? "#00C896" : "#FF6B6B" }}>{s.distractions}</div>
                </div>
                <div style={{
                  background: s.score >= 85 ? "rgba(0,200,150,0.12)" : "rgba(255,107,107,0.1)",
                  color: s.score >= 85 ? "#00C896" : "#FF8888",
                  borderRadius: "8px", padding: "4px 12px", fontSize: "13px", fontWeight: 700
                }}>{s.score}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
