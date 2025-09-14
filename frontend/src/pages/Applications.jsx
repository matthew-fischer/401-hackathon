import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as API from "../api/django"; // make sure path is correct
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";
import CommunicationsModal from "../components/CommunicationsModal";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    dateApplied: new Date().toISOString().slice(0, 10),
    status: "applied",
    notes: "",
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [resumeMarkdown, setResumeMarkdown] = useState("");
  const [loadingResume, setLoadingResume] = useState(true);

  // Fetch applications
  useEffect(() => {
    API.listApplications()
      .then((data) => {
        const mapped = data.map((a) => ({
          ...a,
          company: a.company_name,
          role: a.position,
          dateApplied: a.date_applied,
        }));
        setApps(mapped);
      })
      .catch(console.error);
  }, []);

  // Fetch resume markdown
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/resumes/1/"); // adjust endpoint
        if (!res.ok) throw new Error("Failed to fetch resume");
        const data = await res.json();
        if (data.content_md) setResumeMarkdown(data.content_md);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchResume();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log(resumeMarkdown);
      const created = await API.createApplication(form, resumeMarkdown);
      const mapped = {
        ...created,
        company: created.company_name,
        role: created.position,
        dateApplied: created.date_applied,
      };
      setApps((prev) => [mapped, ...prev]);
      setForm({
        company: "",
        role: "",
        dateApplied: new Date().toISOString().slice(0, 10),
        status: "applied",
        notes: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          maxWidth: 1200,
          margin: "0 auto",
          padding: 16,
          gap: 32,
        }}
      >
        {/* Left Column: Applications */}
        <div style={{ flex: 1.2 }}>
          <h2>Applications</h2>

          <Card style={{ marginBottom: 16 }}>
            <form
              onSubmit={submit}
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <input
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <input
                type="date"
                value={form.dateApplied}
                onChange={(e) =>
                  setForm({ ...form, dateApplied: e.target.value })
                }
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>applied</option>
                <option>phone</option>
                <option>onsite</option>
                <option>offer</option>
                <option>rejected</option>
              </select>
              <textarea
                placeholder="Notes"
                style={{ gridColumn: "1 / -1", minHeight: 80 }}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <button style={{ gridColumn: "1 / -1", justifySelf: "start" }}>
                Add Application
              </button>
            </form>
          </Card>

          <Card style={{ maxHeight: 700, overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr
                    key={a.id}
                    style={{
                      borderTop: "1px solid #2a2a2a",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedApplication(a)}
                  >
                    <td>{a.company}</td>
                    <td>{a.role}</td>
                    <td>{a.dateApplied}</td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right Column: Resume */}
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column" }}>
          <h2>Resume</h2>
          {loadingResume ? (
            <p>Loading resume...</p>
          ) : resumeMarkdown ? (
            <div
              style={{
                display: "flex",
                gap: 16,
                maxHeight: 700,
                overflow: "hidden",
              }}
            >
              {/* Editable Markdown */}
              <Card style={{ flex: 1, overflow: "hidden", padding: 0 }}>
                <textarea
                  value={resumeMarkdown}
                  onChange={(e) => setResumeMarkdown(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontFamily: "monospace",
                    fontSize: 14,
                    lineHeight: 1.5,
                    padding: 12,
                  }}
                />
              </Card>

              {/* Rendered Markdown Preview */}
              <Card
                style={{
                  flex: 1,
                  maxHeight: "100%",
                  overflowY: "auto",
                  padding: 12,
                  backgroundColor: "#fafafa",
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        style={{ color: "#333", fontWeight: 500 }}
                        {...props}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 style={{ color: "#222" }} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 style={{ color: "#222" }} {...props} />
                    ),
                  }}
                >
                  {resumeMarkdown}
                </ReactMarkdown>
              </Card>
            </div>
          ) : (
            <p>No resume uploaded yet.</p>
          )}
        </div>
      </div>

      {selectedApplication && (
        <CommunicationsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </>
  );
}
