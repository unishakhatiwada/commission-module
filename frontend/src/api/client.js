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

client.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || "Something went wrong";
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export default client;