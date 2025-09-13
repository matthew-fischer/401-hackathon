import { useEffect, useMemo, useState } from "react";
import * as API from "../api/django";          
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";

const STATUSES = ["applied","interview","offer","rejected"];

export default function Dashboard() {
  const [apps, setApps] = useState([]);

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
                    <select
                      value={a.status}
                      onChange={(e) => move(a, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: 4 }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} disabled={s === a.status}>{s}</option>
                      ))}
                    </select>
                  </div>
                </Card>
              ))}
              {grouped[s].length === 0 && <div style={{color:"#9aa0a6",fontSize:13}}>No items</div>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}