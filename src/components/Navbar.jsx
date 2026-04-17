export default function Navbar({ page, onNavigate, onLogout, user }) {
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "study", label: "Study Mode" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(120,80,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: "64px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "8px",
          background: "linear-gradient(135deg, #7850FF, #C062FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, color: "#fff"
        }}>P</div>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#E8E8F0", letterSpacing: "-0.02em" }}>PadhAI</span>
      </div>

      <div style={{ display: "flex", gap: "0.25rem" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNavigate(l.id)} style={{
            background: page === l.id ? "rgba(120,80,255,0.15)" : "transparent",
            border: page === l.id ? "1px solid rgba(120,80,255,0.3)" : "1px solid transparent",
            color: page === l.id ? "#C062FF" : "#888899",
            borderRadius: "8px", padding: "6px 16px", cursor: "pointer",
            fontSize: "13px", fontWeight: 500, transition: "all 0.2s"
          }}>{l.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "13px", color: "#888899" }}>
          {user?.name || "Student"}
        </span>
        <button onClick={onLogout} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          color: "#888899", borderRadius: "8px", padding: "6px 14px",
          cursor: "pointer", fontSize: "12px"
        }}>Sign Out</button>
      </div>
    </nav>
  );
}
