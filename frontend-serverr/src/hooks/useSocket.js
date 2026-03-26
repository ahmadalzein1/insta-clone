import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext/SocketContext';

export const useSocket = () => {
    const context = useContext(SocketContext);
    console.log(context);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
