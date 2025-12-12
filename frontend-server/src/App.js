import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useTheme } from "./contexts/ThemeContext.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={`app ${theme}`}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Link to="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
          InstaClone
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleTheme}>
            {theme === "light" ? "Dark 🌙" : "Light ☀️"}
          </button>

          {user ? (
            <>
              <span>@{user.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "20px auto" }}>
        <Routes>
          <Route
            path="/"
            element={user ? <FeedPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
