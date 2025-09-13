import { useEffect, useState } from "react";
import * as API from "../api/mock";
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    company:"", role:"", dateApplied:new Date().toISOString().slice(0,10), status:"applied", notes:""
  });

  useEffect(() => { API.listApplications().then(setApps); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const created = await API.createApplication(form);
    setApps(prev => [created, ...prev]);
    setForm({ company:"", role:"", dateApplied:new Date().toISOString().slice(0,10), status:"applied", notes:"" });
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:16 }}>
      <h2>Applications</h2>
      <Card style={{ marginBottom:16 }}>
        <form onSubmit={submit} style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(2, 1fr)" }}>
          <input placeholder="Company" value={form.company} onChange={e=>setForm({...form, company:e.target.value})}/>
          <input placeholder="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}/>
          <input type="date" value={form.dateApplied} onChange={e=>setForm({...form, dateApplied:e.target.value})}/>
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option>applied</option><option>phone</option><option>onsite</option><option>offer</option><option>rejected</option>
          </select>
          <textarea placeholder="Notes" style={{ gridColumn:"1 / -1", minHeight:80 }}
                    value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          <button style={{ gridColumn:"1 / -1", justifySelf:"start" }}>Add Application</button>
        </form>
      </Card>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
          <thead><tr><th>Company</th><th>Role</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {apps.map(a=>(
              <tr key={a.id} style={{ borderTop:"1px solid #2a2a2a" }}>
                <td>{a.company}</td><td>{a.role}</td><td>{a.dateApplied}</td>
                <td><StatusBadge status={a.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

