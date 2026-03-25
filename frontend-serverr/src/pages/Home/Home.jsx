import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { PostCard } from '../../components/PostCard/PostCard';
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

        // Listen for new posts globally so we can refresh the feed instantly
        const handleNewPost = () => fetchFeed();
        window.addEventListener('postCreated', handleNewPost);
        return () => window.removeEventListener('postCreated', handleNewPost);
    }, [fetchFeed]);

    if (loading) return (
        <div className={styles.centered}>
            <div className={styles.spinner} />
        </div>
    );
    if (error) return <div className={styles.centeredError}>{error}</div>;

    return (
        <div className={styles.feedContainer}>
            {posts.length === 0 ? (
                <div className={styles.emptyFeed}>
                    <span className={styles.emptyIcon}>📷</span>
                    <h2>Your feed is empty</h2>
                    <p>Follow users or create a post to see it here!</p>
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </div>
    );
};

