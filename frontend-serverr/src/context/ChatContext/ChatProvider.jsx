import { useState, useEffect, useCallback } from 'react';
import { ChatContext } from './ChatContext';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api';

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [conversations, setConversations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingConversations, setLoadingConversations] = useState(false);

    // 1. Fetch conversations from the backend
    const fetchConversations = useCallback(async () => {
        console.log("fetchConversations")
        // Only fetch if a user is logged in
        if (!user) {
            setConversations([]);
            setUnreadCount(3);
            return;
        }
        console.log("start")
        setLoadingConversations(true);
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);
            // In a real app, you might calculate unreadCount from backend data here based on read receipts
        } catch (err) {
            console.error('Failed to load conversations', err);
        } finally {
            setLoadingConversations(false);
            console.log("done")
        }
    }, [user]);

    // 2. Initial fetch when user logs in
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // 3. Listen for incoming message notifications via WebSocket
    useEffect(() => {
        console.log("above ")
        if (!socket) return;

        const handleNewNotification = (notification) => {
            if (notification.type === 'message') {
                // If we get a new message notification while scrolling the home feed,
                // we bump the unread count and refresh the conversation list so it 
                // goes to the top!
                setUnreadCount((prev) => prev + 1);
                fetchConversations();
            }
        };

        socket.on('notification:new', handleNewNotification);
        console.log("2");

        return () => {
            socket.off('notification:new', handleNewNotification);
            console.log("off")
        };
    }, [socket, fetchConversations]);

    // Helper to clear unread count (e.g., when they open the messages page)
    const clearUnreadCount = () => setUnreadCount(0);
    const date = Date.now();
    console.log(date + " :ChatProvider socket:" + socket + " conversations:" + conversations + " unreadCount:" + unreadCount + " loadingConversations:" + loadingConversations)

    return (
        <ChatContext.Provider
            value={{
                conversations,
                loadingConversations,
                fetchConversations,
                unreadCount,
                clearUnreadCount,
                date
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
