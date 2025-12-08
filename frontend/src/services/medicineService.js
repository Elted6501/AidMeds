import api from './api';

export const medicineService = {
    // Get all medicines
    getAll: async () => {
        const response = await api.get('/medicines');
        return response.data;
    },

    // Get medicine by ID
    getById: async (id) => {
        const response = await api.get(`/medicines/${id}`);
        return response.data;
    },

    // Search medicines by name
    search: async (query) => {
        const response = await api.get(`/medicines/search?q=${query}`);
        return response.data;
    },

    // Create new medicine (admin only)
    create: async (medicineData) => {
        const response = await api.post('/medicines', medicineData);
        return response.data;
    },

    // Update medicine (admin only)
    update: async (id, medicineData) => {
        const response = await api.put(`/medicines/${id}`, medicineData);
        return response.data;
    },

    // Delete medicine (admin only)
    delete: async (id) => {
        const response = await api.delete(`/medicines/${id}`);
        return response.data;
    }
};
