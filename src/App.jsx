import { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    }
  }, [user]);

  return (
    <div>
      {user ? <Chat user={user} /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;