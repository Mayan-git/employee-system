import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AIRecommendation({ API }) {
  const { token } = useAuth();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const getAI = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch {
      setResult("Error connecting to AI");
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🤖 AI Performance Recommendations</h2>
      <p style={styles.sub}>
        AI will analyze all employees and provide promotion recommendations, training suggestions, and rankings.
      </p>
      <button onClick={getAI} disabled={loading} style={styles.btn}>
        {loading ? "⏳ Analyzing employees..." : "🚀 Generate AI Recommendations"}
      </button>

      {result && (
        <div style={styles.result}>
          <h3 style={{ color: "#60a5fa", marginBottom: "16px" }}>AI Analysis Result:</h3>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" },
  title: { color: "#f1f5f9", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "8px" },
  sub: { color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px", lineHeight: 1.6 },
  btn: {
    padding: "14px 32px", background: "#7c3aed", border: "none",
    borderRadius: "10px", color: "#fff", fontWeight: 700,
    cursor: "pointer", fontSize: "1rem", marginBottom: "24px",
  },
  result: { background: "#0f172a", borderRadius: "12px", padding: "24px", border: "1px solid #7c3aed33" },
  pre: { whiteSpace: "pre-wrap", color: "#e2e8f0", fontFamily: "inherit", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 },
};