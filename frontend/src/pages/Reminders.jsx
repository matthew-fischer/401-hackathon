import { useEffect, useState } from "react";
import * as API from "../api/django";
import Card from "../components/Card";

export default function Reminders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.listReminders()
      .then(data => {
        const mapped = data.map(r => ({
          id: r.id,
          applicationId: r.application_id,
          company: r.app_company,     // comes from serializer
          role: r.app_role,           // comes from serializer
          message: r.message,
          dueAt: r.due_at,
          sentAt: r.sent_at,
          channel: r.channel,
          kind: r.kind,
          email: r.email,
          createdAt: r.created_at,
        }));
        setRows(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card style={{ marginTop: 20 }}>
      <div style={{ paddingBottom: 8, fontWeight: 700, borderBottom: "1px solid #2a2a2a" }}>
        Reminders
      </div>

      {loading ? (
        <div style={{ padding: 12, opacity: 0.7 }}>Loading…</div>
      ) : (
        <div style={{ padding: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#161616" }}>
                <th style={th}>ID</th>
                <th style={th}>Company</th>
                <th style={th}>Role</th>
                <th style={th}>Message</th>
                <th style={th}>Due</th>
                <th style={th}>Sent</th>
                <th style={th}>Channel</th>
                <th style={th}>Kind</th>
                <th style={th}>Email</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...td, textAlign: "center", opacity: 0.7 }}>
                    No reminders
                  </td>
                </tr>
              ) : (
                rows.map(r => (
                  <tr key={r.id} style={{ borderTop: "1px solid #2a2a2a" }}>
                    <td style={td}>{r.id}</td>
                    <td style={td}>{r.company || `#${r.applicationId}`}</td>
                    <td style={td}>{r.role || "-"}</td>
                    <td style={td}>{r.message || "-"}</td>
                    <td style={td}>{r.dueAt ? new Date(r.dueAt).toLocaleString() : "-"}</td>
                    <td style={td}>{r.sentAt ? new Date(r.sentAt).toLocaleString() : "-"}</td>
                    <td style={td}>{r.channel}</td>
                    <td style={td}>{r.kind}</td>
                    <td style={td}>{r.email || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

const th = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #2a2a2a", fontWeight: 700 };
const td = { padding: "10px 12px" };
