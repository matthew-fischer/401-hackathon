import { useEffect, useState, useMemo } from "react";
import { fetchAllReminders, markReminderDone } from "../api/reminders";

function formatWhen(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d - now;
  const mins = Math.round(Math.abs(diffMs) / 60000);
  const label = diffMs < 0 ? "overdue" : "in";
  if (mins < 60) return `${label} ${mins} min`;
  const hrs = Math.round(mins / 60);
  return `${label} ${hrs} hr`;
}

export default function RemindersPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await fetchAllReminders();
    setItems(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return items
      .filter(r => !r.sent_at) // unsent
      .sort((a,b) => new Date(a.due_at) - new Date(b.due_at));
  }, [items]);

  return (
    <div style={{
      background:"#0d0d0d", border:"1px solid #222", borderRadius:12, padding:16,
      minWidth: 320
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h3 style={{margin:0}}>Reminders</h3>
        <button onClick={load} style={{fontSize:12, padding:"6px 10px"}}>Refresh</button>
      </div>

      {loading && <p style={{opacity:.7}}>Loading…</p>}
      {!loading && upcoming.length === 0 && (
        <p style={{opacity:.7, marginTop:12}}>No upcoming reminders.</p>
      )}

      <ul style={{listStyle:"none", padding:0, marginTop:12, display:"grid", gap:8}}>
        {upcoming.map(r => (
          <li key={r.id} style={{
            border:"1px solid #222", borderRadius:10, padding:"10px 12px",
            display:"grid", gap:6
          }}>
            <div style={{display:"flex", justifyContent:"space-between", gap:8}}>
              <strong style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                {r.message || "Reminder"}
              </strong>
              <span style={{
                fontSize:12, padding:"2px 8px", borderRadius:9999,
                background: new Date(r.due_at) < new Date() ? "#3b0d0d" : "#0d2a12",
                color: new Date(r.due_at) < new Date() ? "#ffb4b4" : "#a8ffbf",
                border: "1px solid #222"
              }}>
                {formatWhen(r.due_at)}
              </span>
            </div>
            <div style={{fontSize:12, opacity:.8}}>
              Due: {new Date(r.due_at).toLocaleString()}
            </div>
            <div>
              <button
                onClick={async () => { await markReminderDone(r.id); await load(); }}
                style={{fontSize:12, padding:"6px 10px"}}
              >
                Mark done
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
