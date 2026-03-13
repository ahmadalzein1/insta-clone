import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
    const { user } = useAuth();

    // If no user, kick them to the login page!
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user exists, let them see the page they requested!
    return <Outlet />;
};
