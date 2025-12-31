import { Outlet, Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import React, { useState } from "react";


export default function AppLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // simple page title from path (optional)
  const pageTitle =
    location.pathname.startsWith("/chat") ? "Chat" :
    location.pathname.startsWith("/search") ? "Search" :
    location.pathname.startsWith("/admin") ? "Admin" :
    location.pathname.startsWith("/profile") ? "Profile" :
    "Feed";

  return (
    <div className={`app ${theme}`}>
     
      {/* ✅ Header always */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "var(--bg, #fff)",
        }}
      >
        
        
          {user && (
    <button
      onClick={() => setSidebarOpen((prev) => !prev)}
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "4px 8px",
        cursor: "pointer",
      }}
      title="Toggle sidebar"
    >
      {sidebarOpen ? "⬅️" : "➡️"}
    </button>
  )}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: "bold", fontSize: 20 }}>
            InstaClone
          </Link>
          <span style={{ opacity: 0.7 }}>{pageTitle}</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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

      {/* ✅ Body with optional sidebar */}
      <div style={{ display: "flex" }}>
        {user && (
<aside
  style={{
    width: sidebarOpen ? 220 : 64,
    padding: sidebarOpen ? 14 : 8,
    borderRight: "1px solid #e5e7eb",
    height: "calc(100vh - 54px)",
    position: "sticky",
    top: 54,
    transition: "width 0.25s ease",
    overflow: "hidden",
  }}
>

<nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
  <Link to="/">🏠 {sidebarOpen && "Feed"}</Link>
  <Link to="/search">🔍 {sidebarOpen && "Search"}</Link>
  <Link to="/chat">💬 {sidebarOpen && "Chat"}</Link>
  <Link to={`/profile/${user.id}`}>👤 {sidebarOpen && "Profile"}</Link>
  {user.role === "admin" && (
    <Link to="/admin">🛠 {sidebarOpen && "Admin"}</Link>
  )}
</nav>

          </aside>
        )}

        <main style={{ flex: 1, maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
