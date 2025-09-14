import { useState } from "react";
import { createReminder } from "../api/reminders";

export default function ReminderForm({ applicationId }) {
  const [dueAt, setDueAt] = useState(new Date(Date.now()+3600e3).toISOString().slice(0,16)); // +1h local
  const [message, setMessage] = useState("Follow up email");
  const [channel, setChannel] = useState("in-app");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    // datetime-local gives local time; convert to ISO
    const iso = new Date(dueAt).toISOString();
    await createReminder({ application: applicationId, due_at: iso, message, channel, email });
    alert("Reminder set!");
  };

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:8 }}>
      <label>When</label>
      <input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} />
      <label>Message</label>
      <input value={message} onChange={e=>setMessage(e.target.value)} />
      <label>Channel</label>
      <select value={channel} onChange={e=>setChannel(e.target.value)}>
        <option value="in-app">In-app</option>
        <option value="email">Email</option>
      </select>
      {channel === "email" && (
        <>
          <label>Send to</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </>
      )}
      <button>Save reminder</button>
    </form>
  );
}