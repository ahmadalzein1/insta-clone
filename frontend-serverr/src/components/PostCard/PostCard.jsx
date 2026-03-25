import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';
import { PostActions } from './PostActions';
import { PostComments } from './PostComments';
import { usePostLike } from '../../hooks/usePostLike';

const BACKEND = 'http://localhost:5000';

function timeAgo(dateStr) {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return new Date(dateStr).toLocaleDateString();
}

export const PostCard = ({ post }) => {
    // --- Like logic moved to hook ---
    const { liked, likeCount, handleLike } = usePostLike(post);

    // --- Comment view toggle state ---
    const [showComments, setShowComments] = useState(false);



    const imageUrl = post.image?.startsWith('http')
        ? post.image
        : `${BACKEND}/${post.image}`;

    return (
        <article className={styles.card}>
            {/* ── Header ── */}
            <div className={styles.header}>
                <Link to={`/profile/${post.user_id}`} className={styles.userLink}>
                    {post.avatar ? (
                        <img
                            src={post.avatar.startsWith('http') ? post.avatar : `${BACKEND}/${post.avatar}`}
                            alt={post.username}
                            className={styles.avatar}
                        />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {post.username?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <span className={styles.username}>{post.username}</span>
                </Link>
                <span className={styles.timestamp}>{timeAgo(post.created_at)}</span>
            </div>

            {/* ── Image ── */}
            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={post.caption || 'Post'}
                    className={styles.postImage}
                    onDoubleClick={handleLike}
                />
            </div>

            {/* ── Actions ── */}
            <PostActions
                liked={liked}
                likeCount={likeCount}
                onLike={handleLike}
                onCommentClick={() => setShowComments(v => !v)}
            />

            {/* ── Caption ── */}
            {post.caption && (
                <div className={styles.caption}>
                    <Link to={`/profile/${post.user_id}`} className={styles.captionUser}>
                        {post.username}
                    </Link>{' '}
                    {post.caption}
                </div>
            )}

            {/* ── Comments ── */}
            <PostComments
                post={post}
                showComments={showComments}
                onShowComments={setShowComments}
            />
        </article>
    );
};
