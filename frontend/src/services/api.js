import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Matches backend index.js PORT 3000
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });

export const getEntries = (limit = 50, offset = 0) => api.get(`/entries?limit=${limit}&offset=${offset}`);
export const createEntry = (content) => api.post('/entries', { content });

export const getTimeline = (days = 30) => api.get(`/analytics/timeline?days=${days}`);
export const getStats = () => api.get('/analytics/stats');

export default api;
