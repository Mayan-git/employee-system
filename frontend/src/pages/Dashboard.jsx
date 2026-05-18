import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeList from "../components/EmployeeList.jsx";
import AIRecommendation from "../components/AIRecommendation.jsx";

export default function Dashboard({ API }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("employees");
  const [refresh, setRefresh] = useState(0);

  const tabs = [
    { id: "employees", label: "👥 Employees" },
    { id: "add", label: "➕ Add Employee" },
    { id: "ai", label: "🤖 AI Recommendations" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>👔 EmployeeAI</h1>
          <p style={styles.sub}>Welcome, {user?.name}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ ...styles.tab, ...(tab === t.id && styles.activeTab) }}
            >{t.label}</button>
          ))}
          <button onClick={logout} style={styles.logout}>Logout</button>
        </div>
      </header>

      {/* Content */}
      <main style={styles.main}>
        {tab === "add" && (
          <EmployeeForm API={API} onAdded={() => { setRefresh(r => r + 1); setTab("employees"); }} />
        )}
        {tab === "employees" && (
          <EmployeeList API={API} refresh={refresh} onRefresh={() => setRefresh(r => r + 1)} />
        )}
        {tab === "ai" && <AIRecommendation API={API} />}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f172a" },
  header: {
    background: "#1e293b", padding: "16px 32px", display: "flex",
    alignItems: "center", justifyContent: "space-between",
    borderBottom: "1px solid #334155",
  },
  logo: { color: "#f1f5f9", fontFamily: "Georgia, serif", fontSize: "1.5rem" },
  sub: { color: "#94a3b8", fontSize: "0.8rem", marginTop: "2px" },
  tab: {
    padding: "8px 16px", border: "1px solid #334155", borderRadius: "8px",
    background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem",
  },
  activeTab: { background: "#3b82f6", color: "#fff", borderColor: "#3b82f6", fontWeight: 600 },
  logout: {
    padding: "8px 16px", border: "1px solid #ef4444", borderRadius: "8px",
    background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem",
  },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" },
};