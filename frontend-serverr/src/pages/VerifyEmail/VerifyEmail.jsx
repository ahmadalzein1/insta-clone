import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api';
import styles from './VerifyEmail.module.css';

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }
        api.get(`/auth/verify-email?token=${token}`)
            .then(res => {
                setStatus('success');
                setMessage(res.data.message || 'Email verified successfully!');
            })
            .catch(err => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Token expired or invalid.');
            });
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>InstaClone</h1>
                {status === 'loading' && (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Verifying your email…</p>
                    </div>
                )}
                {status === 'success' && (
                    <div className={styles.success}>
                        <span className={styles.icon}>✅</span>
                        <h2>Email Verified!</h2>
                        <p>{message}</p>
                        <Link to="/login" className={styles.btn}>Log in now</Link>
                    </div>
                )}
                {status === 'error' && (
                    <div className={styles.error}>
                        <span className={styles.icon}>❌</span>
                        <h2>Verification Failed</h2>
                        <p>{message}</p>
                        <Link to="/login" className={styles.link}>Back to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};
