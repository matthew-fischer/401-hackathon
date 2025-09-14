import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Resumes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || "Untitled Resume");

    try {
      const res = await fetch("http://localhost:8000/api/pdf-to-markdown/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Response:", data);

      if (data.content_md) {
        setMarkdown(data.content_md);
      } else {
        alert("Resume uploaded, but no markdown returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Resumes</h2>
      <p>Upload your master resume as a PDF and convert it to Markdown.</p>

      <input
        type="text"
        placeholder="Resume Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: "block", marginBottom: 8 }}
      />

      <button onClick={handleUpload}>Upload Resume</button>

      {markdown && (
        <div style={{ marginTop: 24 }}>
          <h3>Converted Resume (Rendered)</h3>
          <div
            style={{
              background: "#fff",
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 8,
              maxWidth: 800,
            }}
          >
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>

          <h3 style={{ marginTop: 24 }}>Raw Markdown</h3>
          <pre style={{ background: "#f4f4f4", color:"black", padding: 12, borderRadius: 4 }}>
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
