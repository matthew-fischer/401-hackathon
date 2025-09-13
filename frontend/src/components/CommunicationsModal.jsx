import { useState, useEffect } from "react";

const COMM_TYPES = ["communication", "interview", "rejection", "offer"];

export default function CommunicationsModal({ application, onClose }) {
  const [communications, setCommunications] = useState([]);
  const [form, setForm] = useState({
    date_received: new Date().toISOString().slice(0, 10),
    type: "communication",
    notes: "",
  });
  const BASE_URL = "http://127.0.0.1:8000/api";

  // Fetch communications from backend
  useEffect(() => {
    if (!application) return;

    fetch(`${BASE_URL}/applications/${application.id}/communications/`)
      .then((res) => res.json())
      .then((data) => setCommunications(data))
      .catch(console.error);
  }, [application]);

  const handleAdd = async () => {
    if (!application) return;

    const payload = { ...form };

    try {
      const res = await fetch(
        `${BASE_URL}/applications/${application.id}/communications/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save communication");

      const newComm = await res.json();
      setCommunications((prev) => [newComm, ...prev]);
      setForm({
        date_received: new Date().toISOString().slice(0, 10),
        type: "communication",
        notes: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!application) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#f9f9f9",
          color: "#222",
          padding: 24,
          borderRadius: 12,
          width: "90%",
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>
          {application.company_name} - {application.position}
        </h2>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Communications</h4>
          {communications.length === 0 && <p>No communications yet.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {communications.map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <strong>{c.date_received}</strong> - {c.type}
                {c.notes && `: ${c.notes}`}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: 16, display: "grid", gap: 8 }}>
          <input
            type="date"
            value={form.date_received}
            onChange={(e) =>
              setForm({ ...form, date_received: e.target.value })
            }
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {COMM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={{
              minHeight: 80,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
