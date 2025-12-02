import { useState } from "react";

export default function Navbar({ isLoggedIn, handleLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <a href="/" style={styles.logo}>BizScanner</a>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Hamburger Icon for mobile */}
        <div style={styles.hamburger} onClick={() => setOpen(!open)}>
          ☰
        </div>

        <div style={{ ...styles.links, ...(open ? styles.linksOpen : {}) }}>
          {isLoggedIn ? (
            <>
              <a href="/" style={styles.link}>Search</a>
              <a href="/profile" style={styles.link}>Profile</a>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={styles.link}>Login</a>
              <a href="/register" style={styles.link}>Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "#1e293b",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
  },
  logo: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  hamburger: {
    display: "none",
    fontSize: "28px",
    cursor: "pointer",
    marginLeft: "15px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  linksOpen: {
    display: "flex",
    flexDirection: "column",
    background: "#334155",
    position: "absolute",
    top: "60px",
    right: "20px",
    padding: "15px",
    borderRadius: "8px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
