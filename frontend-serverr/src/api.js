import axios from 'axios';

// 1. Create the Axios instance pointing to your backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Matches your Express server port!
});

// 2. Add an interceptor to automatically attach the token
api.interceptors.request.use(
    (config) => {
        // Look for the token in LocalStorage
        const token = localStorage.getItem('token');

        // If it exists, add it to the headers just like your backend expects: "Bearer <token>"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
