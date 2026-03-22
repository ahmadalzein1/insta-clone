import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import styles from './Home.module.css';

export const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchFeed = useCallback(async () => {
        try {
            const response = await api.get('/posts/feed');
            const feedData = response.data.posts || response.data || [];
            setPosts(feedData);
        } catch (err) {
            setError('Failed to load your feed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    if (loading) return <div className={styles.centered}>Loading feed...</div>;
    if (error) return <div className={styles.centeredError}>{error}</div>;

    return (
        <div className={styles.feedContainer}>
            {posts.length === 0 ? (
                <div className={styles.emptyFeed}>
                    <h2>Welcome to InstaClone!</h2>
                    <p>Follow some users or create a post to see them here.</p>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id}>{post.caption}</div>
                ))
            )}
        </div>
    );
};
