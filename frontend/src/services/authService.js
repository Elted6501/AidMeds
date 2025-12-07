import api from './api';

export const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Logout user
    logout: async () => {
        localStorage.removeItem('token');
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    // Change password
    changePassword: async (passwords) => {
        const response = await api.put('/users/password', passwords);
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
