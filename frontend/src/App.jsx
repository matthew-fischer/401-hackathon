import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Fetch error:", err);
        setMessage("Error fetching from API");
      });
  }, []);

  return (
    <div>
      <h1>React + Django (Vite)</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;


