import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';

function getInitialAuth() {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return { token: null, user: null };
    try {
        const decodedUser = jwtDecode(savedToken);
        if (decodedUser.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return { token: null, user: null };
        }
        return { token: savedToken, user: decodedUser };
    } catch {
        localStorage.removeItem('token');
        return { token: null, user: null };
    }
}

export const AuthProvider = ({ children }) => {
    const [{ token, user }, setAuth] = useState(getInitialAuth);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        const decodedUser = jwtDecode(newToken);
        setAuth({ token: newToken, user: decodedUser });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};