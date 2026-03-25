import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import styles from './ForgotPassword.module.css';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>InstaClone</h1>
                <div className={styles.lockIcon}>🔒</div>
                <h2 className={styles.title}>Trouble logging in?</h2>
                <p className={styles.subtitle}>
                    Enter your email address and we'll send you a link to get back into your account.
                </p>

                {sent ? (
                    <div className={styles.sentBox}>
                        <p>✅ {message}</p>
                        <p className={styles.hint}>Check your inbox (and spam folder).</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <button type="submit" disabled={loading} className={styles.btn}>
                            {loading ? 'Sending…' : 'Send reset link'}
                        </button>
                    </form>
                )}

                <div className={styles.divider} />
                <Link to="/register" className={styles.link}>Create new account</Link>
                <div className={styles.backBox}>
                    <Link to="/login" className={styles.back}>Back to login</Link>
                </div>
            </div>
        </div>
    );
};
