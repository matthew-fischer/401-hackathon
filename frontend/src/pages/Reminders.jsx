import { useEffect, useState } from "react";
import * as API from "../api/django";
import Card from "../components/Card";

function toLocalInputValue(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    application: "",        // FK id (optional if model allows null)
    message: "",
    channel: "in-app",      // or "email"
    email: "",
    dueAt: toLocalInputValue(new Date()),
    kind: "",               // keep if your model has "kind" (or remove)
  });

  // load reminders + apps for the dropdown
  useEffect(() => {
    API.listReminders()
      .then(data => {
        const mapped = data.map(r => ({
          id: r.id,
          application: r.application ?? null,
          message: r.message ?? "",
          channel: r.channel,
          email: r.email ?? "",
          dueAt: r.due_at,
          sentAt: r.sent_at,
          kind: r.kind ?? r.type ?? null,
        }));
        setReminders(mapped);
      })
      .catch(console.error);

    API.listApplications()
      .then(data => {
        const mapped = data.map(a => ({
          id: a.id,
          company: a.company_name,
          role: a.position
        }));
        setApps(mapped);
      })
      .catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      application: form.application || null,            // set null if optional
      message: form.message,
      channel: form.channel,
      email: form.channel === "email" ? form.email : "",
      due_at: new Date(form.dueAt).toISOString(),      // send ISO to Django
      // kind: form.kind,                               // include only if backend expects it
    };
    try {
      const created = await API.createReminder(payload);
      const mapped = {
        id: created.id,
        application: created.application ?? null,
        message: created.message ?? "",
        channel: created.channel,
        email: created.email ?? "",
        dueAt: created.due_at,
        sentAt: created.sent_at,
        kind: created.kind ?? created.type ?? null,
      };
      setReminders(prev => [mapped, ...prev]);
      setForm(f => ({ ...f, message: "", dueAt: toLocalInputValue(new Date()) }));
    } catch (err) {
      console.error(err);
      alert("Failed to create reminder (see console).");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this reminder?")) return;
    try {
      await API.deleteReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const th = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #2a2a2a", fontWeight: 700 };
  const td = { padding: "10px 12px", borderBottom: "1px solid #2a2a2a" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h2>Reminders</h2>

      <Card style={{ marginBottom: 16 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, 1fr)" }}>
          <select
            value={form.application}
            onChange={(e) => setForm({ ...form, application: e.target.value })}
          >
            <option value="">(No application)</option>
            {apps.map(a => (
              <option key={a.id} value={a.id}>
                {a.company} — {a.role}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.dueAt}
            onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
          />

          <select
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value })}
          >
            <option value="in-app">in-app</option>
            <option value="email">email</option>
          </select>

          <input
            placeholder="Email (only if channel=email)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={form.channel !== "email"}
          />

          <textarea
            placeholder="Message"
            style={{ gridColumn: "1 / -1", minHeight: 80 }}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button style={{ gridColumn: "1 / -1", justifySelf: "start" }}>
            Add Reminder
          </button>
        </form>
      </Card>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Application</th>
              <th style={th}>Message</th>
              <th style={th}>Due</th>
              <th style={th}>Sent</th>
              <th style={th}>Channel</th>
              <th style={th}>Email</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {reminders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...td, textAlign: "center", opacity: .7 }}>No reminders</td>
              </tr>
            ) : (
              reminders.map(r => (
                <tr key={r.id} style={{ borderTop: "1px solid #2a2a2a" }}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.application ?? "-"}</td>
                  <td style={td}>{r.message || "-"}</td>
                  <td style={td}>{r.dueAt ? new Date(r.dueAt).toLocaleString() : "-"}</td>
                  <td style={td}>{r.sentAt ? new Date(r.sentAt).toLocaleString() : "-"}</td>
                  <td style={td}>{r.channel}</td>
                  <td style={td}>{r.email || "-"}</td>
                  <td style={td}>
                    <button onClick={() => remove(r.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
