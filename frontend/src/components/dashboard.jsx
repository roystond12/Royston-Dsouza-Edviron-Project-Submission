import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {/* Theme Toggle at top right */}
      <button onClick={toggleTheme} className={styles.themeToggle}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back 👋</h2>
        {user && (
          <p className={styles.subtitle}>
            Hello, <strong>{user.username}</strong>
          </p>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => navigate("/transactions")}
            className={styles.proceedButton}
          >
            Proceed to Payments
          </button>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
