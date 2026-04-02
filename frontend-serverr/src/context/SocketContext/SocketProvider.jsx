import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { useAuth } from '../../hooks/useAuth';

export const SocketProvider = ({ children }) => {
    const { token } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        console.log("SocketProvider useEffect");
        if (!token) {
            if (socket) {
                //socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Establish connection
        const newSocket = io('http://localhost:5000', {
            auth: { token }
        });

        // Debugging
        newSocket.on('connect', () => {
            console.log('CONNECTED TO SOCKET SERVER');
        });

        newSocket.on('connect_error', (err) => {
            console.log('Socket connection error:', err.message);
        });

        setSocket(newSocket);

        // Cleanup on unmount or token change
        return () => {
            newSocket.disconnect();
        };
    }, [token]);
    console.log("Socket Provider socket:", socket)
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
