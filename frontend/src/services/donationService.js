import api from './api';

export const donationService = {
    // Get all donations (admin)
    getAll: async () => {
        const response = await api.get('/donations');
        return response.data;
    },

    // Get user's donations
    getMyDonations: async () => {
        const response = await api.get('/donations');
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

    // Accept donation (admin)
    accept: async (id) => {
        const response = await api.put(`/donations/${id}/accept`);
        return response.data;
    },

    // Reject donation (admin)
    reject: async (id, motivo = '') => {
        const response = await api.put(`/donations/${id}/reject`, { motivo });
        return response.data;
    },

    // Get pending donations (admin)
    getPending: async () => {
        const response = await api.get('/donations/pending');
        return response.data;
    },

    // Legacy method for backward compatibility
    updateStatus: async (id, status) => {
        if (status === 'aprobada' || status === 'aceptada') {
            return donationService.accept(id);
        } else if (status === 'rechazada') {
            return donationService.reject(id);
        }
        throw new Error(`Unknown status: ${status}`);
    }
};
