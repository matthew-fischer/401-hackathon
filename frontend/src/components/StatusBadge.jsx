export default function StatusBadge({ status }) {
  const map = {
    applied: { bg: "#18324d", fg: "#9fd1ff" },
    interview: { bg: "#49341a", fg: "#ffd18b" },
    offer: { bg: "#1f3e35", fg: "#81e6d9" },
    rejected: { bg: "#3e1f24", fg: "#f9a8a8" },
  };

  const { bg, fg } = map[status] ?? { bg: "#222", fg: "#ddd" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color: fg,
        height: 24,             // fixed height
        padding: "0 12px",      // horizontal padding
        borderRadius: 12,       // smooth but consistent corners
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        boxShadow: `0 2px 6px ${bg}50`,
        transition: "all 0.2s ease",
      }}
    >
      {status}
    </span>
  );
}



