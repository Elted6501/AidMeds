import api from './api';

export const requestService = {
    // Get all requests (admin)
    getAll: async () => {
        const response = await api.get('/requests');
        return response.data;
    },

    // Get user's requests
    getMyRequests: async () => {
        const response = await api.get('/requests/my-requests');
        return response.data;
    },

    // Get request by ID
    getById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    // Create new request
    create: async (requestData) => {
        const response = await api.post('/requests', requestData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update request status (admin)
    updateStatus: async (id, status) => {
        const response = await api.put(`/requests/${id}/status`, { estado: status });
        return response.data;
    },

    // Get pending requests (admin)
    getPending: async () => {
        const response = await api.get('/requests/pending');
        return response.data;
    }
};
