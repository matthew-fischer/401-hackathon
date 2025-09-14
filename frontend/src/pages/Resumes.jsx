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
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Resumes</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Upload your PDF resume and view the converted Markdown version.
      </p>

      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Resume Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            marginBottom: "12px",
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "12px" }}
        />

        <button
          onClick={handleUpload}
          style={{
            background: "#4f46e5",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Upload Resume
        </button>
      </div>

      {markdown && (
  <div
    style={{
      background: "#fff",
      padding: "24px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      maxHeight: "500px",   // 👈 fixed height
      overflowY: "auto",    // 👈 scroll inside
    }}
  >
    <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
      Converted Resume
    </h3>
    <div
      style={{
        lineHeight: "1.6",
        fontSize: "16px",
        color: "#333",
      }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  </div>
)}
    </div>
  );
}
