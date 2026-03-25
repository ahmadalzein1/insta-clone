import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // We need this to log the user in!
import api from '../../api';
import styles from './Login.module.css';

export const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // Grab the login function from your Context!
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🚀 Hit your backend login route
            const response = await api.post('/auth/login', {
                emailOrUsername,  // Your backend accepts either!
                password
            });

            // If successful, pass the shiny new token to our Context
            login(response.data.token);

            // Send them to the Feed!
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h1 className={styles.logo}>InstaClone</h1>

                {successMessage && <div className={styles.success}>{successMessage}</div>}
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Phone number, username, or email"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <div className={styles.forgotPassword}>
                    <Link to="/forgot-password" className={styles.metaLink}>Forgot password?</Link>
                </div>
            </div>

            <div className={styles.signupBox}>
                <p>
                    Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};
