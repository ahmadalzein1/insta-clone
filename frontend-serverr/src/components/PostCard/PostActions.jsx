import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import styles from './PostActions.module.css';

export const PostActions = ({ liked, likeCount, onLike, onCommentClick }) => {
    return (
        <>
            <div className={styles.actions}>
                <div className={styles.leftActions}>
                    <button
                        className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
                        onClick={onLike}
                        aria-label={liked ? 'Unlike' : 'Like'}
                    >
                        <Heart
                            size={24}
                            fill={liked ? 'var(--danger)' : 'none'}
                            color={liked ? 'var(--danger)' : 'currentColor'}
                            className={styles.heartIcon}
                        />
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={onCommentClick}
                        aria-label="Comment"
                    >
                        <MessageCircle size={24} />
                    </button>
                </div>
                <button className={styles.actionBtn} aria-label="Save">
                    <Bookmark size={24} />
                </button>
            </div>

            {likeCount > 0 && (
                <div className={styles.likeCount}>
                    <strong>{likeCount.toLocaleString()}</strong> {likeCount === 1 ? 'like' : 'likes'}
                </div>
            )}
        </>
    );
};
