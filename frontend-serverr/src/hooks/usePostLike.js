import { useState, useRef, useEffect } from 'react';
import api from '../api';

export const usePostLike = (post) => {
    const [liked, setLiked] = useState(post.liked_by_me);
    const [likeCount, setLikeCount] = useState(Number(post.likes_count));
    
    // Memory of what the server actually thinks (vital for rollbacks)
    const serverLiked = useRef(post.liked_by_me);
    const serverCount = useRef(Number(post.likes_count));
    
    // Holds the ID of our "bomb timer" so we can defuse it
    const timeoutRef = useRef(null);

    const handleLike = () => {
        // 1. INSTANT UI (Optimistic update on screen)
        const newLiked = !liked;
        const newCount = newLiked ? likeCount + 1 : likeCount - 1;
        
        setLiked(newLiked);
        setLikeCount(newCount);

        // 2. DEFUSE PREVIOUS TIMER 
        // If they click again before 500ms, the previous network request is ERASED!
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 3. SET NEW TIMER (Wait 500ms before sending anything)
        timeoutRef.current = setTimeout(async () => {
            // If they double-clicked (Like -> Unlike), the final state matches what the server 
            // already has. We can just do nothing!
            if (newLiked === serverLiked.current) {
                return; 
            }

            try {
                if (newLiked) {
                    await api.post(`/likes/${post.id}`);
                } else {
                    await api.delete(`/likes/${post.id}`);
                }
                
                // Success! Update our memory of what the server knows.
                serverLiked.current = newLiked;
                serverCount.current = newCount;
                
            } catch (error) {
                // Rollins back purely to the server state, completely destroying "stale snapshot" bugs!
                setLiked(serverLiked.current);
                setLikeCount(serverCount.current);
            }
        }, 500); 
    };

    // Cleanup if component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return { liked, likeCount, handleLike };
};