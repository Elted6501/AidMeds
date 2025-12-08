import api from './api';

export const requestService = {
    // Get all requests (admin)
    getAll: async () => {
        const response = await api.get('/requests');
        return response.data;
    },

    // Get user's requests
    getMyRequests: async () => {
        const response = await api.get('/requests');
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

    // Approve request (admin)
    approve: async (id) => {
        const response = await api.put(`/requests/${id}/approve`);
        return response.data;
    },

    // Reject request (admin)
    reject: async (id, motivo = '') => {
        const response = await api.put(`/requests/${id}/reject`, { motivo });
        return response.data;
    },

    // Deliver request (admin)
    deliver: async (id) => {
        const response = await api.put(`/requests/${id}/deliver`);
        return response.data;
    },

    // Get pending requests (admin)
    getPending: async () => {
        const response = await api.get('/requests/pending');
        return response.data;
    },

    // Legacy method for backward compatibility
    updateStatus: async (id, status) => {
        if (status === 'aprobada') {
            return requestService.approve(id);
        } else if (status === 'rechazada') {
            return requestService.reject(id);
        } else if (status === 'entregada') {
            return requestService.deliver(id);
        }
        throw new Error(`Unknown status: ${status}`);
    }
};
