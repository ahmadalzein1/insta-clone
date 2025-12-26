import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";


export default function GuestOnly() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
