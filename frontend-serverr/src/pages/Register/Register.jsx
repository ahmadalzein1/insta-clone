import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api'; // Import your custom axios instance!
import styles from './Register.module.css'; // We will make this CSS file next

export const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Update state when they type in the inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Run this when they click the "Sign Up" button
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the page from reloading
        setError('');
        setLoading(true);

        try {
            // 🚀 Send the data to your backend!
            const response = await api.post('/auth/register', formData);

            // If successful, your backend sends back "verify your account via a link sent to your email"
            alert(response.data.message);

            // Send them to the login page so they can log in after verifying!
            navigate('/login');

        } catch (err) {
            // If the backend sends an error (like "Email already in use"), show it to the user
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h1 className={styles.logo}>InstaClone</h1>
                <p className={styles.subtitle}>Sign up to see photos and videos from your friends.</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            <div className={styles.loginBox}>
                <p>
                    Have an account? <Link to="/login" className={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    );
};
