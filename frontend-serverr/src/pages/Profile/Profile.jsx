import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid3X3, UserMinus, UserPlus } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

const BACKEND = 'http://localhost:5000';

export const Profile = () => {
    const { id } = useParams();
    const { user: me } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Optimistic follow state
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/users/${id}`);
                setProfileData(res.data);
                setIsFollowing(res.data.isFollowing);
                setFollowerCount(Number(res.data.stats.followers_count));
            } catch {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // --- Optimistic Follow / Rollback ---
    const handleFollow = async () => {
        if (followLoading) return;
        const prevFollowing = isFollowing;
        const prevCount = followerCount;

        setIsFollowing(!isFollowing);
        setFollowerCount(c => isFollowing ? c - 1 : c + 1);
        setFollowLoading(true);

        try {
            if (prevFollowing) {
                await api.delete(`/follow/${id}`);
            } else {
                await api.post(`/follow/${id}`);
            }
        } catch {
            // Rollback
            setIsFollowing(prevFollowing);
            setFollowerCount(prevCount);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return <div className={styles.centered}><div className={styles.spinner} /></div>;
    if (error) return <div className={styles.centeredError}>{error}</div>;
    if (!profileData) return null;

    const { user, posts, stats } = profileData;
    const isMyProfile = me?.id === user.id;

    const avatarUrl = user.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `${BACKEND}/${user.avatar}`)
        : null;

    return (
        <div className={styles.page}>
            <div className={styles.profileContainer}>
                {/* ── Profile Header ── */}
                <div className={styles.header}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={user.username} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {user.username?.[0]?.toUpperCase()}
                        </div>
                    )}

                    <div className={styles.info}>
                        <div className={styles.usernameRow}>
                            <h1 className={styles.username}>{user.username}</h1>
                            {!isMyProfile && (
                                <button
                                    className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                >
                                    {isFollowing ? (
                                        <><UserMinus size={14} />  Following</>
                                    ) : (
                                        <><UserPlus size={14} />  Follow</>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <strong>{stats.posts_count}</strong>
                                <span>posts</span>
                            </div>
                            <div className={styles.statItem}>
                                <strong>{followerCount}</strong>
                                <span>followers</span>
                            </div>
                            <div className={styles.statItem}>
                                <strong>{stats.following_count}</strong>
                                <span>following</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Posts Grid ── */}
                <div className={styles.postsDivider}>
                    <Grid3X3 size={14} />
                    <span>POSTS</span>
                </div>

                {posts.length === 0 ? (
                    <div className={styles.noPosts}>
                        <p>No posts yet.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {posts.map(post => {
                            const imgSrc = post.image?.startsWith('http')
                                ? post.image
                                : `${BACKEND}/${post.image}`;
                            return (
                                <div key={post.id} className={styles.gridItem}>
                                    <img src={imgSrc} alt={post.caption || 'post'} className={styles.gridImg} />
                                    <div className={styles.gridOverlay}>
                                        <span>❤ {post.likes_count || 0}</span>
                                        <span>💬 {post.comments_count || 0}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
