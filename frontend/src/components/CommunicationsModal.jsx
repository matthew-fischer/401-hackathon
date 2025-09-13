import { useState, useEffect } from "react";

const COMM_TYPES = [
  "Communication",
  "Interview Invitation",
  "Rejection",
  "Job Offer",
];

export default function CommunicationsModal({ application, onClose, onSave }) {
  const [communications, setCommunications] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Communication",
    notes: "",
  });

  useEffect(() => {
    if (application.communications) {
      setCommunications(application.communications);
    } else {
      setCommunications([]);
    }
  }, [application]);

  const handleAdd = () => {
    const newComm = {
      id: Date.now(),
      ...form,
    };
    setCommunications((prev) => [newComm, ...prev]);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      type: "Communication",
      notes: "",
    });
    if (onSave) onSave(newComm);
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
          {application.company} - {application.role}
        </h2>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Communications</h4>
          {communications.length === 0 && <p>No communications yet.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {communications.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <strong>{c.date}</strong> - {c.type}
                {c.notes && `: ${c.notes}`}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: 16, display: "grid", gap: 8 }}>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {COMM_TYPES.map((t) => (
              <option key={t}>{t}</option>
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
