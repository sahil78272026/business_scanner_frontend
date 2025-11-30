import { useState } from "react";
import { loginUser } from "../api"; // your api file

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const data = await loginUser(email, password);

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";   // go back to homepage
      }

    if (data.error) setError(data.error);
    else window.location.href = "/"; // redirect
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" onChange={(e)=>setPassword(e.target.value)} type="password" />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}
