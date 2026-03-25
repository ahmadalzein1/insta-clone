import { useState, useRef } from 'react';
import { X, ImagePlus, Loader } from 'lucide-react';
import api from '../../api';
import styles from './CreatePost.module.css';

export const CreatePost = ({ onClose, onCreated }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) { setError('Please select an image.'); return; }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);

        try {
            const res = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Tell the rest of the app (like the Home feed) that a post was created!
            window.dispatchEvent(new Event('postCreated'));

            onCreated?.();
            onClose?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose?.()}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.title}>Create new post</span>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Image picker */}
                    <div
                        className={`${styles.imageArea} ${preview ? styles.hasPreview : ''}`}
                        onClick={() => !preview && fileRef.current?.click()}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className={styles.preview} />
                                <button
                                    type="button"
                                    className={styles.removeImg}
                                    onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); }}
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                <ImagePlus size={48} strokeWidth={1.5} />
                                <p>Click to select a photo</p>
                                <span>JPG, PNG, WEBP</span>
                            </div>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenInput}
                            onChange={handleFile}
                        />
                    </div>

                    {/* Caption */}
                    <textarea
                        placeholder="Write a caption…"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        className={styles.caption}
                        rows={3}
                        maxLength={500}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" disabled={loading || !image} className={styles.submitBtn}>
                        {loading ? <Loader size={18} className={styles.spin} /> : 'Share'}
                    </button>
                </form>
            </div>
        </div>
    );
};
