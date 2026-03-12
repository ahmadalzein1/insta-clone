import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { Sun, Moon, LogOut, Home } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <Link to="/" className={styles.titleLink}>
                    <h2 className={styles.title}>InstaClone</h2>
                </Link>

                <div className={styles.actions}>
                    {user && (
                        <div className={styles.navLinks}>
                            <Link to="/" className={styles.iconButton} aria-label="Home">
                                <Home size={22} />
                            </Link>
                        </div>
                    )}

                    {/* The Theme Toggle Icon */}
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
    );
};
