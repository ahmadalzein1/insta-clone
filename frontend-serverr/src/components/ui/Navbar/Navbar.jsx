import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { Sun, Moon, LogOut, Home, PlusSquare } from 'lucide-react';
import { SearchBar } from '../../SearchBar/SearchBar';
import { CreatePost } from '../../CreatePost/CreatePost';
import styles from './Navbar.module.css';

const BACKEND = 'http://localhost:5000';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showCreate, setShowCreate] = useState(false);

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `${BACKEND}/${user.avatar}`)
        : null;

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    {/* Logo */}
                    <Link to="/" className={styles.titleLink}>
                        <h2 className={styles.title}>InstaClone</h2>
                    </Link>

                    {/* Search bar — center */}
                    {user && <SearchBar />}

                    {/* Right actions */}
                    <div className={styles.actions}>
                        {user && (
                            <div className={styles.navLinks}>
                                <Link to="/" className={styles.iconButton} aria-label="Home">
                                    <Home size={22} />
                                </Link>
                                <button
                                    className={styles.iconButton}
                                    aria-label="Create Post"
                                    onClick={() => setShowCreate(true)}
                                >
                                    <PlusSquare size={22} />
                                </button>
                                {/* Profile avatar */}
                                <Link to={`/profile/${user.id}`} className={styles.iconButton} aria-label="Profile">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={user.username} className={styles.navAvatar} />
                                    ) : (
                                        <div className={styles.navAvatarFallback}>
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            </div>
                        )}

                        {/* Theme toggle */}
                        <button onClick={toggleTheme} className={styles.iconButton} aria-label="Toggle Theme">
                            {theme === 'light' ? (
                                <Moon size={20} color="#60a5fa" fill="#60a5fa" />
                            ) : (
                                <Sun size={20} color="#f59e0b" fill="#f59e0b" />
                            )}
                        </button>

                        {user ? (
                            <div className={styles.userSection}>
                                <button onClick={logout} className={styles.logoutButton}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <span className={styles.greeting}>Not logged in</span>
                        )}
                    </div>
                </div>
            </nav>

            {/* Create Post modal */}
            {showCreate && (
                <CreatePost
                    onClose={() => setShowCreate(false)}
                    onCreated={() => setShowCreate(false)}
                />
            )}
        </>
    );
};
