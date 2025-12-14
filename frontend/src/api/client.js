import axios from 'axios';

// Create a configured instance
const client = axios.create({
    // Automatically loads the URL from .env file
    baseURL: process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {

            if (error.config.url.includes('/login')) {
                return Promise.reject(error);
            }

            localStorage.removeItem('auth_token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default client;