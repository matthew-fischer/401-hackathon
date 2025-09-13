import { useEffect } from "react";
import { fetchDueReminders } from "./api/reminders";

function ensureToastRoot() {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    Object.assign(root.style, {
      position: "fixed", right: "16px", bottom: "16px",
      display: "flex", flexDirection: "column", gap: "10px", zIndex: 9999,
    });
    document.body.appendChild(root);
  }
  return root;
}

function showToast(msg) {
  const root = ensureToastRoot();
  const el = document.createElement("div");
  el.textContent = msg || "Reminder due";
  Object.assign(el.style, {
    background: "#111", color: "#fff", border: "1px solid #2a2a2a",
    padding: "10px 14px", borderRadius: "10px", boxShadow: "0 6px 24px #0007",
    maxWidth: "360px", fontSize: "14px", opacity: 0, transform: "translateY(6px)",
    transition: "opacity .2s ease, transform .2s ease",
  });
  root.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = "translateY(0)"; });
  setTimeout(() => {
    el.style.opacity = 0; el.style.transform = "translateY(6px)";
    setTimeout(() => el.remove(), 200);
  }, 4500);
}

export default function NotificationProvider({ children }) {
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const tick = async () => {
      const due = await fetchDueReminders(); // backend marks them sent
      due.forEach(d => {
        const text = d.message || "Reminder due";
        showToast(text);
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Reminder", { body: text });
        }
      });
    };

    tick();                           // run once on mount
    const id = setInterval(tick, 30000); // every 30s
    return () => clearInterval(id);
  }, []);

  return children;
}
