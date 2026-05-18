import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployeeList({ API, refresh, onRefresh }) {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [editing, setEditing] = useState(null);
  const [editScore, setEditScore] = useState("");

  const fetch_ = async () => {
    const url = dept
      ? `${API}/api/employees/search?department=${dept}&name=${search}`
      : search
      ? `${API}/api/employees/search?name=${search}`
      : `${API}/api/employees`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setEmployees(Array.isArray(data) ? data : []);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch_(); }, [refresh, search, dept]);

  const del = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await fetch(`${API}/api/employees/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    onRefresh();
  };

  const update = async (id) => {
    await fetch(`${API}/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ performanceScore: parseFloat(editScore) }),
    });
    setEditing(null);
    onRefresh();
  };

  const scoreColor = (s) => s >= 80 ? "#4ade80" : s >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div>
      {/* Search & Filter */}
      <div style={styles.searchBar}>
        <input
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Filter by department..."
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          style={styles.input}
        />
        <span style={{ color: "#94a3b8", fontSize: "0.85rem", alignSelf: "center" }}>
          {employees.length} employees
        </span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {employees.map((e) => (
          <div key={e._id} style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h3 style={styles.name}>{e.name}</h3>
                  <span style={styles.dept}>{e.department}</span>
                  <span style={{ ...styles.score, color: scoreColor(e.performanceScore) }}>
                    ⭐ {e.performanceScore}/100
                  </span>
                </div>
                <p style={styles.email}>{e.email} • {e.experience} yrs experience</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {e.skills.map((s) => (
                    <span key={s} style={styles.skill}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => { setEditing(e._id); setEditScore(e.performanceScore); }} style={styles.editBtn}>
                  Edit Score
                </button>
                <button onClick={() => del(e._id)} style={styles.delBtn}>Delete</button>
              </div>
            </div>

            {editing === e._id && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <input
                  type="number" value={editScore}
                  onChange={(ev) => setEditScore(ev.target.value)}
                  placeholder="New score (0-100)"
                  style={{ ...styles.input, width: "180px" }}
                />
                <button onClick={() => update(e._id)} style={styles.editBtn}>Save</button>
                <button onClick={() => setEditing(null)} style={styles.delBtn}>Cancel</button>
              </div>
            )}
          </div>
        ))}
        {employees.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#475569" }}>
            <p style={{ fontSize: "3rem" }}>👥</p>
            <p>No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  searchBar: { display: "flex", gap: "12px", marginBottom: "20px" },
  input: {
    padding: "10px 14px", background: "#1e293b", border: "1px solid #334155",
    borderRadius: "8px", color: "#f1f5f9", fontSize: "0.9rem", flex: 1,
  },
  card: { background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px" },
  name: { color: "#f1f5f9", fontSize: "1.05rem", margin: 0 },
  dept: { padding: "3px 10px", background: "#1d4ed833", color: "#60a5fa", borderRadius: "20px", fontSize: "0.75rem" },
  score: { fontWeight: 700, fontSize: "0.9rem" },
  email: { color: "#64748b", fontSize: "0.82rem", margin: 0 },
  skill: { padding: "3px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "20px", color: "#94a3b8", fontSize: "0.75rem" },
  editBtn: { padding: "6px 14px", background: "#3b82f6", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "0.8rem" },
  delBtn: { padding: "6px 14px", background: "transparent", border: "1px solid #ef4444", borderRadius: "6px", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" },
};
