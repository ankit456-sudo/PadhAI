import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import StudyMode from "./pages/StudyMode";
import Analytics from "./pages/Analytics";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const navigate = (p) => setPage(p);
  const login = (u) => { setUser(u); setPage("dashboard"); };
  const logout = () => { setUser(null); setPage("landing"); };

  if (page === "landing") return <LandingPage onGetStarted={() => navigate("auth")} />;
  if (page === "auth") return <AuthPage onLogin={login} onBack={() => navigate("landing")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#E8E8F0", fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <Navbar page={page} onNavigate={navigate} onLogout={logout} user={user} />
      <div style={{ paddingTop: "64px" }}>
        {page === "dashboard" && <Dashboard onStartStudy={() => navigate("study")} onViewAnalytics={() => navigate("analytics")} />}
        {page === "study" && <StudyMode onExit={() => navigate("dashboard")} />}
        {page === "analytics" && <Analytics />}
      </div>
    </div>
  );
}
