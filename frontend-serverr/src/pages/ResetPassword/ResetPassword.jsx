import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import styles from './ResetPassword.module.css';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            navigate('/login', { state: { message: 'Password reset! You can now log in.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p className={styles.error}>Invalid reset link.</p>
                    <Link to="/login" className={styles.link}>Back to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>InstaClone</h1>
                <h2 className={styles.title}>Reset your password</h2>
                <p className={styles.subtitle}>Enter a new password for your account.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" disabled={loading} className={styles.btn}>
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>
                <Link to="/login" className={styles.link}>Back to login</Link>
            </div>
        </div>
    );
};
