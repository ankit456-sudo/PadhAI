export default function Analytics() {
  const weekData = [
    { day: "Mon", hours: 3.2, score: 88 },
    { day: "Tue", hours: 4.5, score: 92 },
    { day: "Wed", hours: 2.1, score: 74 },
    { day: "Thu", hours: 5.0, score: 95 },
    { day: "Fri", hours: 3.8, score: 87 },
    { day: "Sat", hours: 2.6, score: 81 },
    { day: "Sun", hours: 1.2, score: 69 },
  ];

  const subjects = [
    { name: "Data Structures", hours: 8.4, score: 91, color: "#7850FF" },
    { name: "DBMS", hours: 6.2, score: 84, color: "#C062FF" },
    { name: "Computer Networks", hours: 5.7, score: 88, color: "#00C896" },
    { name: "Operating Systems", hours: 4.1, score: 79, color: "#FFB800" },
    { name: "Software Engineering", hours: 3.3, score: 85, color: "#FF6B6B" },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem", fontFamily: "'Sora', sans-serif" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Deep Work Analytics</h2>
        <p style={{ margin: "0.4rem 0 0", color: "#666677", fontSize: "14px" }}>Your genuine focus, measured accurately</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Focus Hours", value: "22.5h", sub: "This week", color: "#7850FF" },
          { label: "Avg Focus Score", value: "83.7%", sub: "Across all sessions", color: "#00C896" },
          { label: "Sessions Completed", value: "18", sub: "This week", color: "#C062FF" },
          { label: "Streak", value: "7 days", sub: "Keep going! 🔥", color: "#FFB800" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "1.25rem"
          }}>
            <div style={{ fontSize: "11px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{s.label}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#444455", marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Weekly chart */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "1.25rem" }}>Weekly Study Hours</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "140px" }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <div style={{
                    width: "100%", borderRadius: "6px 6px 0 0",
                    height: `${(d.hours / maxHours) * 100}%`,
                    background: "linear-gradient(to top, #7850FF, #C062FF)",
                    minHeight: "4px", transition: "height 0.5s ease"
                  }} />
                </div>
                <div style={{ fontSize: "10px", color: "#555566" }}>{d.day}</div>
                <div style={{ fontSize: "10px", color: "#C062FF", fontFamily: "'JetBrains Mono', monospace" }}>{d.hours}h</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score chart */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "1.25rem" }}>Daily Focus Score</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ fontSize: "12px", color: "#555566", width: "28px" }}>{d.day}</div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "100px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${d.score}%`,
                    background: d.score >= 85 ? "linear-gradient(90deg,#00C896,#00E5AC)" : d.score >= 75 ? "linear-gradient(90deg,#FFB800,#FFD060)" : "linear-gradient(90deg,#FF6B6B,#FF9494)",
                    borderRadius: "100px"
                  }} />
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#888899", fontFamily: "'JetBrains Mono', monospace", width: "36px" }}>{d.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "1.25rem" }}>Subject Breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {subjects.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: "13px" }}>{s.name}</div>
              <div style={{ flex: 2, background: "rgba(255,255,255,0.05)", borderRadius: "100px", height: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(s.hours / 8.4) * 100}%`, background: s.color, borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "12px", color: "#888899", width: "36px", fontFamily: "'JetBrains Mono', monospace" }}>{s.hours}h</div>
              <div style={{
                background: `${s.color}20`, color: s.color, borderRadius: "6px",
                padding: "3px 10px", fontSize: "11px", fontWeight: 600, width: "44px", textAlign: "center"
              }}>{s.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
