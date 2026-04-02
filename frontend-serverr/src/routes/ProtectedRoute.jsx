import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    console.log("Protected")
    useEffect(() => {
        console.log("Protected useEffect");
    });

    // If no user, kick them to the login page!
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user exists, let them see the page they requested!
    return <Outlet />;
};
