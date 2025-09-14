import { useEffect, useMemo, useState } from "react";
import * as API from "../api/django";          
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";

const STATUSES = ["applied","interview","offer","rejected"];

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Fetch applications from Django and map fields
  useEffect(() => { 
    API.listApplications()
      .then(data => {
        const mapped = data.map(a => ({
          ...a,
          company: a.company_name,
          role: a.position,
          dateApplied: a.date_applied
        }));
        setApps(mapped);
      })
      .catch(console.error); 
  }, []);

   useEffect(() => {
    API.listReminders()
      .then(data => {
        const mapped = data.map(r => ({
          id: r.id,
          appId: r.application,     // FK id; show this or join on client if you want names
          message: r.message,
          dueAt: r.due_at,
          sentAt: r.sent_at,
          channel: r.channel,
          kind: r.kind,
        }));
        setReminders(mapped);
      })
      .catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    const g = { applied:[], interview:[], offer:[], rejected:[] };
    apps.forEach(a => g[a.status]?.push(a));
    return g;
  }, [apps]);

  const next = s => {
    const i = STATUSES.indexOf(s);
    return i >= 0 && i < STATUSES.length-1 ? STATUSES[i+1] : null;
  };

  const move = async (a, status) => {
    try {
      const updated = await API.updateApplication(a.id, { status });
      // Map backend fields for consistency
      const mapped = {
        ...updated,
        company: updated.company_name,
        role: updated.position,
        dateApplied: updated.date_applied
      };
      setApps(prev => prev.map(x => x.id === a.id ? mapped : x));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:16 }}>
      <h1>Job Application Organizer</h1>
      <div style={{ display:"grid", gap:14, gridTemplateColumns:"repeat(5, 1fr)" }}>
        {STATUSES.map(s => (
          <section key={s} style={{ background:"#121212", border:"1px solid #2a2a2a", borderRadius:12, minHeight:220 }}>
            <div style={{ padding:10, borderBottom:"1px solid #2a2a2a", fontWeight:700 }}>{s.toUpperCase()}</div>
            <div style={{ padding:12 }}>
              {grouped[s].map(a => (
                <Card key={a.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.company}</div>
                      <div style={{ opacity: 0.8, fontSize: 13 }}>{a.role}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>Applied: {a.dateApplied}</div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ position: "relative", width: "100%" }}>
                  <select
                    value={a.status}
                    onChange={(e) => move(a, e.target.value)}
                    style={{
                      appearance: "none",          // remove default arrow
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      background: "#1e1e1e",       // dark background
                      color: "#fff",               // text color
                      padding: "6px 28px 6px 10px", // right padding for arrow
                      borderRadius: 6,
                      border: "1px solid #2a2a2a",
                      fontSize: 13,
                      cursor: "pointer",
                      outline: "none",
                      width: "100%",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} disabled={s === a.status}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {/* Custom arrow */}
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: "5px solid #fff", // arrow color
                    }}
                  />
                </div>
                </div>
                </Card>
              ))}
              {grouped[s].length === 0 && <div style={{color:"#9aa0a6",fontSize:13}}>No items</div>}
            </div>
          </section>
        ))}
      </div>

      {/* Reminders table (full width under the board) */}
      <div style={{ marginTop:20, background:"#121212", border:"1px solid #2a2a2a", borderRadius:12 }}>
        <div style={{ padding:10, borderBottom:"1px solid #2a2a2a", fontWeight:700 }}>Reminders</div>
        <div style={{ padding:12, overflowX:"auto" }}>
          <table style={{ borderCollapse:"collapse", width:"100%" }}>
            <thead>
              <tr style={{ background:"#161616" }}>
                <th style={th}>ID</th>
                <th style={th}>Application</th>
                <th style={th}>Message</th>
                <th style={th}>Due</th>
                <th style={th}>Sent</th>
                <th style={th}>Channel</th>
                <th style={th}>Kind</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr><td colSpan={7} style={{ ...td, textAlign:"center", opacity:.7 }}>No reminders</td></tr>
              ) : (
                reminders.map(r => (
                  <tr key={r.id}>
                    <td style={td}>{r.id}</td>
                    <td style={td}>{r.appId}</td>
                    <td style={td}>{r.message || "-"}</td>
                    <td style={td}>{r.dueAt ? new Date(r.dueAt).toLocaleString() : "-"}</td>
                    <td style={td}>{r.sentAt ? new Date(r.sentAt).toLocaleString() : "-"}</td>
                    <td style={td}>{r.channel}</td>
                    <td style={td}>{r.kind}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th = { textAlign:"left", padding:"10px 12px", borderBottom:"1px solid #2a2a2a", fontWeight:700 };
const td = { padding:"10px 12px", borderBottom:"1px solid #2a2a2a" };
