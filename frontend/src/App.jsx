import { Link, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import Resumes from "./pages/Resumes.jsx";
import Reminders from "./pages/Reminders.jsx";

export default function App() {
  return (
    <div style={{ color:"#eee", background:"#0b0b0b", minHeight:"100vh" }}>
      <nav style={{ display:"flex", gap:12, padding:12, borderBottom:"1px solid #333" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/reminders">Reminders</Link>
        <Link to="/resumes">Resumes</Link>
      </nav>
      <div style={{ padding:16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/resumes" element={<Resumes />} />
        </Routes>
      </div>
    </div>
  );
}

