const BASE = import.meta.env.VITE_API || "http://127.0.0.1:8000/api";

export async function fetchDueReminders() {
  const r = await fetch(`${BASE}/reminders/due/`);
  if (!r.ok) return [];
  return r.json();
}

export async function fetchAllReminders() {
  const r = await fetch(`${BASE}/reminders/`);
  if (!r.ok) return [];
  return r.json();
}

export async function markReminderDone(id) {
  const r = await fetch(`${BASE}/reminders/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sent_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("Failed to mark done");
  return r.json();
}

export async function createReminder(body) {
  const r = await fetch(`${BASE}/reminders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("create failed");
  return r.json();
}

