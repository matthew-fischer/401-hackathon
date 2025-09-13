export default function Card({ children, style }) {
  return (
    <div style={{
      background:"#121212", border:"1px solid #2a2a2a", borderRadius:12, padding:12,
      boxShadow:"0 6px 20px rgba(0,0,0,.25)", ...style
    }}>
      {children}
    </div>
  );
}
