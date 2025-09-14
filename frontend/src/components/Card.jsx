export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
      }}
    >
      {children}
    </div>
  );
}
