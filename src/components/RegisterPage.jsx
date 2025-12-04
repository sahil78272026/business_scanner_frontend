import { useEffect } from "react";
import { registerWithPassword } from "../api";

export default function RegisterPage() {
  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-register-btn"),
      { theme: "filled_blue", size: "large", width: 280 }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.error || "Google sign-up failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google sign-up error");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const data = await registerWithPassword({ name, email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account 🚀</h2>
        <p style={styles.subtitle}>Start saving leads and growing your business.</p>

        <div id="google-register-btn" style={{ marginBottom: 18 }}></div>

        <div style={styles.divider}>or sign up with email</div>

        <form onSubmit={onSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Full Name</label>
            <input name="name" type="text" placeholder="Your Name" style={styles.input} required />
          </div>

          <div>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" placeholder="you@example.com" style={styles.input} required />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" placeholder="••••••••" style={styles.input} required />
          </div>

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={styles.text}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

// 👉 Matching SaaS Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "20px",
    fontSize: "14px",
  },
  divider: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "12px 0 18px",
    position: "relative",
  },
  form: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    marginBottom: "14px",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "white",
    fontWeight: "600",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginTop: "6px",
    fontSize: "16px",
  },
  text: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#475569",
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
  },
};
