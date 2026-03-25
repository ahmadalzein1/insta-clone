import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';
import styles from './PostComments.module.css';

const BACKEND = 'http://localhost:5000';

export const PostComments = ({ post, showComments, onShowComments }) => {
    const { user } = useAuth();
    const [commentCount, setCommentCount] = useState(Number(post.comments_count));
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (!showComments) return;
        const load = async () => {
            setLoadingComments(true);
            try {
                const res = await api.get(`/comments/${post.id}`);
                setComments(res.data);
            } catch {
                // silent fail
            } finally {
                setLoadingComments(false);
            }
        };
        load();
    }, [showComments, post.id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const text = commentText.trim();
        if (!text) return;
        setCommentError('');

        const optimisticComment = {
            id: `temp-${Date.now()}`,
            text,
            user_id: user.id,
            username: user.username,
            avatar: user.avatar || null,
            created_at: new Date().toISOString(),
            _optimistic: true,
        };

        setComments(prev => [...prev, optimisticComment]);
        setCommentCount(c => c + 1);
        setCommentText('');

        try {
            const res = await api.post(`/comments/${post.id}`, { text });
            setComments(prev =>
                prev.map(c => c.id === optimisticComment.id ? res.data : c)
            );
        } catch {
            setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
            setCommentCount(c => c - 1);
            setCommentText(text);
            setCommentError('Failed to post comment. Try again.');
        }
    };

    return (
        <div className={styles.commentsContainer}>
            {commentCount > 0 && !showComments && (
                <button
                    className={styles.viewComments}
                    onClick={() => onShowComments(true)}
                >
                    View all {commentCount} comment{commentCount !== 1 ? 's' : ''}
                </button>
            )}

            {showComments && (
                <div className={styles.commentsList}>
                    {loadingComments ? (
                        <p className={styles.loadingText}>Loading comments…</p>
                    ) : (
                        comments.map(c => (
                            <div
                                key={c.id}
                                className={`${styles.commentItem} ${c._optimistic ? styles.optimistic : ''}`}
                            >
                                <Link to={`/profile/${c.user_id}`}>
                                    {c.avatar ? (
                                        <img
                                            src={c.avatar.startsWith('http') ? c.avatar : `${BACKEND}/${c.avatar}`}
                                            alt={c.username}
                                            className={styles.commentAvatar}
                                        />
                                    ) : (
                                        <div className={styles.commentAvatarFallback}>
                                            {c.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                                <div>
                                    <Link to={`/profile/${c.user_id}`} className={styles.commentUsername}>
                                        {c.username}
                                    </Link>{' '}
                                    <span className={styles.commentText}>{c.text}</span>
                                </div>
                            </div>
                        ))
                    )}
                    {commentError && (
                        <p className={styles.commentError}>{commentError}</p>
                    )}
                </div>
            )}

            <form className={styles.commentForm} onSubmit={handleAddComment}>
                <input
                    type="text"
                    placeholder="Add a comment…"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className={styles.commentInput}
                    maxLength={300}
                />
                <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className={styles.commentSubmit}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
