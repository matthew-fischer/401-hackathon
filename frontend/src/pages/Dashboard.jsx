import { useEffect, useMemo, useState } from "react";
import * as API from "../api/mock";          // use a namespace (prevents duplicate name clashes)
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";
import RemindersPanel from "../components/RemindersPanel";

const STATUSES = ["applied","phone","onsite","offer","rejected"];

export default function Dashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => { API.listApplications().then(setApps); }, []);

  const grouped = useMemo(() => {
    const g = { applied:[], phone:[], onsite:[], offer:[], rejected:[] };
    apps.forEach(a => g[a.status].push(a));
    return g;
  }, [apps]);

  const next = s => {
    const i = STATUSES.indexOf(s);
    return i >= 0 && i < STATUSES.length-1 ? STATUSES[i+1] : null;
  };

  const move = async (a, status) => {
    const updated = await API.updateApplication(a.id, { status });
    setApps(prev => prev.map(x => x.id === a.id ? updated : x));
  };

  return (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
    <h1>Job Application Organizer</h1>
    <p style={{ opacity: .8 }}>Kanban by status (click to move forward)</p>

    {/* 2-column layout: left = your board, right = reminders */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
      {/* LEFT: existing board */}
      <div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(5, 1fr)" }}>
          {STATUSES.map(s => (
            <section key={s} style={{ background: "#121212", border: "1px solid #2a2a2a", borderRadius: 12, minHeight: 220 }}>
              <div style={{ padding: 10, borderBottom: "1px solid #2a2a2a", fontWeight: 700 }}>{s.toUpperCase()}</div>
              <div style={{ padding: 12 }}>
                {grouped[s].map(a => (
                  <Card key={a.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.company}</div>
                        <div style={{ opacity: .8, fontSize: 13 }}>{a.role}</div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, opacity: .75 }}>
                      Applied: {a.dateApplied}
                    </div>
                    {next(a.status) && (
                      <button style={{ marginTop: 10 }} onClick={() => move(a, next(a.status))}>
                        Move to {next(a.status)}
                      </button>
                    )}
                  </Card>
                ))}
                {grouped[s].length === 0 && <div style={{ color: "#9aa0a6", fontSize: 13 }}>No items</div>}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* RIGHT: reminders panel */}
      <RemindersPanel />
    </div>
  </div>
);
}

