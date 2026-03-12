import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>404</h1>
            <h2>Oops! We couldn't find that page.</h2>
            <p style={{ margin: '1rem 0' }}>The link you followed may be broken, or the page may have been removed.</p>

            {/* Give them an easy way to get back to safety! */}
            <Link to="/" style={{ color: 'var(--primary-button)', textDecoration: 'none', fontWeight: 'bold' }}>
                Go back to Instagram
            </Link>
        </div>
    );
};
