import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export const PublicRoute = () => {
    const { user } = useAuth();
    console.log("Public")
    useEffect(() => {
        console.log("Public useEffect");
    });
    // If they are ALREADY logged in, kick them back to the feed
    if (user) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, let them see the Login/Register page
    return <Outlet />;
};
