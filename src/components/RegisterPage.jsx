import { useState } from "react";
import { registerUser } from "../api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    const data = await registerUser(email, password);

    if (data.message === "User registered successfully") {
        window.location.href = "/login";
      }


    if (data.error) setMsg(data.error);
    else setMsg("Registered! You can now login.");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" onChange={(e)=>setPassword(e.target.value)} type="password" />

      <button onClick={handleRegister}>Register</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
