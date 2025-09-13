export default function StatusBadge({ status }) {
  const map = {
    applied:{bg:"#18324d",fg:"#9fd1ff"}, phone:{bg:"#2b3d1f",fg:"#b7e67a"},
    onsite:{bg:"#49341a",fg:"#ffd18b"},  offer:{bg:"#1f3e35",fg:"#81e6d9"},
    rejected:{bg:"#3e1f24",fg:"#f9a8a8"},
  };
  const { bg, fg } = map[status] ?? { bg:"#222", fg:"#ddd" };
  return <span style={{background:bg,color:fg,padding:"4px 8px",borderRadius:999,fontSize:12,textTransform:"uppercase"}}>{status}</span>;
}

