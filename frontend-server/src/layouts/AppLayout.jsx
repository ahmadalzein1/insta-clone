import { Outlet, Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";


export default function AppLayout() {
  
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
              width: 220,
              padding: 14,
              borderRight: "1px solid #e5e7eb",
              height: "calc(100vh - 54px)",
              position: "sticky",
              top: 54,
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/">Feed</Link>
              <Link to="/search">Search</Link>
            
              <Link to="/chat">Chat</Link>
              <Link to={`/profile/${user.id}`}>Profile</Link>
              {user.role === "admin" && <Link to="/admin">Admin</Link>}
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
