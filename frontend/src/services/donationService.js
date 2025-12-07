import api from './api';

export const donationService = {
    // Get all donations (admin)
    getAll: async () => {
        const response = await api.get('/donations');
        return response.data;
    },

    // Get user's donations
    getMyDonations: async () => {
        const response = await api.get('/donations/my-donations');
        return response.data;
    },

    // Get donation by ID
    getById: async (id) => {
        const response = await api.get(`/donations/${id}`);
        return response.data;
    },

    // Create new donation
    create: async (donationData) => {
        const response = await api.post('/donations', donationData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update donation status (admin)
    updateStatus: async (id, status) => {
        const response = await api.put(`/donations/${id}/status`, { estado: status });
        return response.data;
    },

    // Get pending donations (admin)
    getPending: async () => {
        const response = await api.get('/donations/pending');
        return response.data;
    }
};
