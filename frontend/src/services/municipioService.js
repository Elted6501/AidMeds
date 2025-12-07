import api from './api';

export const municipioService = {
    // Get all municipios
    getAll: async () => {
        const response = await api.get('/municipios');
        return response.data;
    }
};
