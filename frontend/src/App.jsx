import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://talent-iq-2ccc.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend connected ✅", data);
      })
      .catch((err) => {
        console.error("Backend connection failed ❌", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Frontend Running ✅</h1>
      <p>Check browser console for backend connection status</p>
    </div>
  );
}

export default App;
