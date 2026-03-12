import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Wrapper
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds { id, username, role, avatar }
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // True while we check for a saved token
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    // Run once when the app starts up
    useEffect(() => {
        const savedToken = localStorage.getItem('token');

        if (savedToken) {
            try {
                // Decode the token to get the user data your backend put inside it
                const decodedUser = jwtDecode(savedToken);

                // Check if token is expired (JWT exp is in seconds, Date.now() is ms)
                if (decodedUser.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(savedToken);
                    setUser(decodedUser);
                }
            } catch (err) {
                console.error("Invalid token found", err);
                logout();
            }
        }

        // We finished checking! Stop loading so the app can render.
        setLoading(false);
    }, []);

    // Use this function when they submit the Login form
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);

        // Decode and set the user immediately
        const decodedUser = jwtDecode(newToken);
        setUser(decodedUser);
    };

    // Use this function when they click "Logout"


    // 3. Provide all this data to the rest of the app!
    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
