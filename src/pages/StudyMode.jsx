import { useState, useEffect, useRef } from "react";

export default function StudyMode({ onExit }) {
  const [status, setStatus] = useState("idle"); // idle | running | paused | distracted
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState("");
  const [distractions, setDistractions] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [alert, setAlert] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status]);

  const fmt = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const triggerDistraction = (type) => {
    setStatus("paused");
    setAlert(type);
    const d = { type, time: fmt(seconds), id: Date.now() };
    setDistractions(prev => [d, ...prev]);
    setTimeout(() => { setAlert(null); setStatus("running"); }, 4000);
  };

  const simulateDistraction = () => {
    const types = ["📱 Phone detected", "👀 Looking away", "🗣 Talking detected", "🚶 Left study area"];
    triggerDistraction(types[Math.floor(Math.random() * types.length)]);
  };

  const start = () => { setStatus("running"); setCameraOn(true); };
  const pause = () => setStatus("paused");
  const resume = () => setStatus("running");

  const focusScore = distractions.length === 0 ? 100 : Math.max(60, 100 - distractions.length * 8);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem", fontFamily: "'Sora', sans-serif" }}>

      {/* Alert Banner */}
      {alert && (
        <div style={{
          position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,50,50,0.95)", borderRadius: "14px", padding: "16px 28px",
          display: "flex", alignItems: "center", gap: "12px", zIndex: 200,
          boxShadow: "0 0 40px rgba(255,50,50,0.5)", animation: "pulse 0.5s ease"
        }}>
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>Distraction Detected!</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{alert} — Timer paused</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Virtual Study Mode</h2>
          <p style={{ margin: "0.3rem 0 0", fontSize: "13px", color: "#666677" }}>AI-powered focus monitoring</p>
        </div>
        <button onClick={onExit} style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#888899", borderRadius: "10px", padding: "10px 20px",
          cursor: "pointer", fontSize: "13px", fontFamily: "'Sora', sans-serif"
        }}>← Exit Session</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
        {/* Left: Timer + Camera */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Subject Input */}
          {status === "idle" && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Subject / Topic</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Data Structures, DBMS..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "12px 16px", color: "#E8E8F0", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", fontFamily: "'Sora', sans-serif"
                }}
              />
            </div>
          )}

          {/* Timer display */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "3rem 2rem", textAlign: "center",
            position: "relative", overflow: "hidden"
          }}>
            {/* Status ring glow */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "20px",
              boxShadow: status === "running" ? "inset 0 0 60px rgba(0,200,150,0.06)" : status === "paused" ? "inset 0 0 60px rgba(255,200,0,0.05)" : "none",
              pointerEvents: "none"
            }} />

            <div style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555566", marginBottom: "1rem" }}>
              {status === "idle" ? "Ready to focus" : status === "running" ? "● Focusing" : status === "paused" ? "◼ Paused" : "⚠ Distracted"}
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "64px", fontWeight: 600,
              color: status === "running" ? "#00C896" : status === "paused" ? "#FFB800" : "#E8E8F0",
              letterSpacing: "0.04em", lineHeight: 1
            }}>
              {fmt(seconds)}
            </div>

            <div style={{ marginTop: "0.75rem", fontSize: "14px", color: "#555566" }}>
              {subject || "No subject set"}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2rem" }}>
              {status === "idle" && (
                <button onClick={start} style={{
                  background: "linear-gradient(135deg, #7850FF, #C062FF)", border: "none",
                  color: "#fff", borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer", fontSize: "15px", fontWeight: 600, fontFamily: "'Sora', sans-serif"
                }}>▶ Start</button>
              )}
              {status === "running" && (
                <button onClick={pause} style={{
                  background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.3)",
                  color: "#FFB800", borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer", fontSize: "15px", fontWeight: 600, fontFamily: "'Sora', sans-serif"
                }}>◼ Pause</button>
              )}
              {status === "paused" && (
                <button onClick={resume} style={{
                  background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.3)",
                  color: "#00C896", borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer", fontSize: "15px", fontWeight: 600, fontFamily: "'Sora', sans-serif"
                }}>▶ Resume</button>
              )}
              {status !== "idle" && (
                <button onClick={() => { setStatus("idle"); setSeconds(0); }} style={{
                  background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)",
                  color: "#FF6B6B", borderRadius: "12px", padding: "14px 20px",
                  cursor: "pointer", fontSize: "15px", fontWeight: 600, fontFamily: "'Sora', sans-serif"
                }}>■ End</button>
              )}
            </div>
          </div>

          {/* Camera panel */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cameraOn ? "#00C896" : "#444" }} />
              <span style={{ fontSize: "13px", color: "#666677" }}>Camera Feed · TensorFlow.js</span>
            </div>
            <div style={{ background: "#111118", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem" }}>
              {cameraOn ? (
                <>
                  <div style={{ fontSize: "36px" }}>📷</div>
                  <div style={{ fontSize: "13px", color: "#00C896" }}>● AI monitoring active</div>
                  <div style={{ fontSize: "11px", color: "#444" }}>TensorFlow.js · Pose Detection · Face API</div>
                  {status === "running" && (
                    <button onClick={simulateDistraction} style={{
                      marginTop: "0.5rem", background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.2)",
                      color: "#FF6B6B", borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
                      fontSize: "11px", fontFamily: "'Sora', sans-serif"
                    }}>⚡ Simulate Distraction</button>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: "36px", opacity: 0.3 }}>📷</div>
                  <div style={{ fontSize: "13px", color: "#444" }}>Camera activates on session start</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats + Log */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Live Stats */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.25rem" }}>
            <div style={{ fontSize: "12px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}>Session Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Focus Score", value: `${focusScore}%`, color: focusScore >= 85 ? "#00C896" : "#FFB800" },
                { label: "Distractions", value: distractions.length, color: distractions.length === 0 ? "#00C896" : "#FF6B6B" },
                { label: "Focused Time", value: fmt(seconds), color: "#7850FF" },
                { label: "AI Model", value: "Active", color: cameraOn ? "#00C896" : "#444" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#555566" }}>{item.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus bar */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "12px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase" }}>Focus Level</span>
              <span style={{ fontSize: "12px", color: "#00C896", fontWeight: 600 }}>{focusScore}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "100px", height: "8px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${focusScore}%`,
                background: `linear-gradient(90deg, #7850FF, #00C896)`,
                borderRadius: "100px", transition: "width 0.8s ease"
              }} />
            </div>
          </div>

          {/* Distraction Log */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.25rem", flex: 1 }}>
            <div style={{ fontSize: "12px", color: "#555566", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}>Distraction Log</div>
            {distractions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "#333344", fontSize: "13px" }}>
                <div style={{ fontSize: "24px", marginBottom: "0.5rem" }}>✨</div>
                No distractions yet!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "280px", overflowY: "auto" }}>
                {distractions.map(d => (
                  <div key={d.id} style={{
                    background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.12)",
                    borderRadius: "8px", padding: "8px 12px",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <span style={{ fontSize: "12px", color: "#FF8888" }}>{d.type}</span>
                    <span style={{ fontSize: "11px", color: "#555566", fontFamily: "'JetBrains Mono', monospace" }}>{d.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
