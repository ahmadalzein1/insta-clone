import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // If they are ALREADY logged in, kick them back to the feed
    if (user) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, let them see the Login/Register page
    return <Outlet />;
};
