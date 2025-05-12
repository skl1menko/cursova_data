// src/services/routeService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5227/api';

export const fetchRouteById = async (routeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/routes/${routeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching route data:', error);
        throw error;
    }
};
