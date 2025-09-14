import { Link, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import Resumes from "./pages/Resumes.jsx";
import Reminders from "./pages/Reminders.jsx";

export default function App() {
  return (
    <div
      style={{
        color: "#eee",
        background: "#0b0b0b",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Full-width sticky navbar */}
      <nav
        style={{
          width: "100%",
          background: "#121212",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            gap: 24,
            padding: "12px 24px",
            alignItems: "center",
          }}
        >
          {["Dashboard", "Applications", "Reminders", "Resumes"].map((text) => (
            <Link
              key={text}
              to={text === "Dashboard" ? "/" : `/${text.toLowerCase()}`}
              style={{
                textDecoration: "none",
                color: "#eee",
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 6,
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {text}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
          background: "#0b0b0b",
          minHeight: "calc(100vh - 60px)", // adjust if navbar height changes
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/resumes" element={<Resumes />} />
        </Routes>
      </main>
    </div>
  );
}

