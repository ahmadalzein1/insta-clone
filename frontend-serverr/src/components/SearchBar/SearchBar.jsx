import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../../api';
import styles from './SearchBar.module.css';

const BACKEND = 'http://localhost:5000';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Debounce search
    useEffect(() => {
        if (!query.trim()) { setResults([]); setOpen(false); return; }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
                setResults(res.data);
                setOpen(true);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (userId) => {
        setQuery('');
        setResults([]);
        setOpen(false);
        navigate(`/profile/${userId}`);
    };

    const clear = () => { setQuery(''); setResults([]); setOpen(false); };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.inputWrap}>
                <Search size={16} className={styles.icon} />
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className={styles.input}
                    onFocus={() => results.length > 0 && setOpen(true)}
                />
                {query && (
                    <button className={styles.clearBtn} onClick={clear} aria-label="Clear">
                        <X size={14} />
                    </button>
                )}
            </div>

            {open && (
                <div className={styles.dropdown}>
                    {loading ? (
                        <div className={styles.hint}>Searching…</div>
                    ) : results.length === 0 ? (
                        <div className={styles.hint}>No results found.</div>
                    ) : (
                        results.map(u => {
                            const avatarUrl = u.avatar
                                ? (u.avatar.startsWith('http') ? u.avatar : `${BACKEND}/${u.avatar}`)
                                : null;
                            return (
                                <button
                                    key={u.id}
                                    className={styles.result}
                                    onClick={() => handleSelect(u.id)}
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={u.username} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {u.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <span className={styles.username}>{u.username}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
