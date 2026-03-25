import { useState } from 'react';
import api from '../api';

export const usePostLike = (post) => {
    const [liked, setLiked] = useState(post.liked_by_me);
    const [likeCount, setLikeCount] = useState(Number(post.likes_count));

    const handleLike = async () => {
        const prevLiked = liked;
        const prevCount = likeCount;

        // Optimistic update
        setLiked(!liked);
        setLikeCount(c => liked ? c - 1 : c + 1);

        try {
            if (prevLiked) {
                await api.delete(`/likes/${post.id}`);
            } else {
                await api.post(`/likes/${post.id}`);
            }
        } catch {
            // Rollback
            setLiked(prevLiked);
            setLikeCount(prevCount);
        }
    };

    return { liked, likeCount, handleLike };
};
