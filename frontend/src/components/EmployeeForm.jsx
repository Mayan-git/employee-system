import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployeeForm({ API, onAdded }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", department: "", skills: "", performanceScore: "", experience: "",
  });
  const [msg, setMsg] = useState("");

  const handle = async () => {
    try {
      const res = await fetch(`${API}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          performanceScore: parseFloat(form.performanceScore),
          experience: parseFloat(form.experience),
        }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg("❌ " + data.message);
      setMsg("✅ Employee added successfully!");
      setForm({ name: "", email: "", department: "", skills: "", performanceScore: "", experience: "" });
      setTimeout(onAdded, 1000);
    } catch {
      setMsg("❌ Server error");
    }
  };

  const fields = [
    { key: "name", label: "Full Name", ph: "Aman Verma" },
    { key: "email", label: "Email", ph: "aman@gmail.com" },
    { key: "department", label: "Department", ph: "Development" },
    { key: "skills", label: "Skills (comma separated)", ph: "React, Node.js, MongoDB" },
    { key: "performanceScore", label: "Performance Score (0-100)", ph: "85" },
    { key: "experience", label: "Years of Experience", ph: "3" },
  ];

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Add New Employee</h2>
      <div style={styles.grid}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={styles.label}>{f.label}</label>
            <input
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.ph}
              style={styles.input}
            />
          </div>
        ))}
      </div>
      <button onClick={handle} style={styles.btn}>Add Employee</button>
      {msg && <p style={{ color: msg.includes("✅") ? "#4ade80" : "#f87171", marginTop: "12px" }}>{msg}</p>}
    </div>
  );
}

const styles = {
  card: { background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" },
  title: { color: "#f1f5f9", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "24px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  label: { color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "6px" },
  input: {
    width: "100%", padding: "11px 13px", background: "#0f172a",
    border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9",
    fontSize: "0.9rem", boxSizing: "border-box",
  },
  btn: {
    padding: "12px 28px", background: "#3b82f6", border: "none",
    borderRadius: "8px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
  },
};