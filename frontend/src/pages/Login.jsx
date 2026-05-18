import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login({ API }) {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    setError("");
    try {
      const url = isSignup ? `${API}/api/auth/signup` : `${API}/api/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      login(data.token, data.user);
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👔 EmployeeAI</h1>
        <p style={styles.sub}>HR Performance Analytics System</p>

        <div style={styles.tabs}>
          <button
            onClick={() => setIsSignup(false)}
            style={{ ...styles.tab, ...((!isSignup) && styles.activeTab) }}
          >Login</button>
          <button
            onClick={() => setIsSignup(true)}
            style={{ ...styles.tab, ...(isSignup && styles.activeTab) }}
          >Sign Up</button>
        </div>

        {isSignup && (
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handle} disabled={loading} style={styles.btn}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0f172a",
  },
  card: {
    background: "#1e293b", padding: "40px", borderRadius: "16px",
    width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  title: {
    fontFamily: "Georgia, serif", fontSize: "2rem", color: "#f1f5f9",
    textAlign: "center", marginBottom: "4px",
  },
  sub: { color: "#94a3b8", textAlign: "center", marginBottom: "28px", fontSize: "0.85rem" },
  tabs: { display: "flex", marginBottom: "20px", borderRadius: "8px", overflow: "hidden", border: "1px solid #334155" },
  tab: {
    flex: 1, padding: "10px", border: "none", background: "transparent",
    color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem",
  },
  activeTab: { background: "#3b82f6", color: "#fff", fontWeight: 600 },
  input: {
    width: "100%", padding: "12px 14px", marginBottom: "14px",
    background: "#0f172a", border: "1px solid #334155", borderRadius: "8px",
    color: "#f1f5f9", fontSize: "0.95rem", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "13px", background: "#3b82f6", border: "none",
    borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
  },
  error: { color: "#f87171", fontSize: "0.85rem", marginBottom: "10px" },
};