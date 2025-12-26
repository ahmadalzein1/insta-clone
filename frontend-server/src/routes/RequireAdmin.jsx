import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RequireAdmin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
