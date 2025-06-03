import axios from 'axios';

const API_BASE = 'http://localhost:5227/api/buses';

// GET: отримати список автобусів
export const getBuss = async () => {
    try {
        const response = await axios.get(API_BASE);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to fetch buses');
    }
};

// POST: додати новий автобус
export const addBus = async (bus) => {
    try {
        const response = await axios.post(API_BASE, {
            ...bus,
            Schedules: []  // Додати порожній масив Schedules або за замовчуванням
        });
        return response.data;
    } catch (error) {
        throw new Error(JSON.stringify(error.response?.data || 'Failed to add bus'));
    }
};

// DELETE: видалити автобус
export const deleteBus = async (id) => {
    try {
        await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
        throw new Error(JSON.stringify(error.response?.data || `Failed to delete bus with ID ${id}`));
    }
};

// PUT: оновити дані автобуса
export const updateBus = async (id, updatedBus) => {
    try {
        const response = await axios.put(`${API_BASE}/${id}`, updatedBus, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data || updatedBus;
    } catch (error) {
        console.error('Update bus error details:', {
            status: error.response?.status,
            data: error.response?.data,
            busId: id,
            updatedBus
        });
        throw new Error(error.response?.data || `Failed to update bus with ID ${id}`);
    }
};


// GET: отримати статистику для конкретного автобуса
export const getBusStats = async (id) => {
    try {
        const response = await axios.get(`${API_BASE}/${id}/stats`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || `Failed to fetch stats for bus with ID ${id}`);
    }
};

// POST: призначити водія до автобуса
export const assignDriverToBus = async (busId, driverId, scheduleData) => {
    try {
        const response = await axios.post(`${API_BASE}/${busId}/assign-driver`, { 
            driverId,
            firstDepartureTime: scheduleData.firstDeparture,
            lastDepartureTime: scheduleData.lastDeparture
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || `Failed to assign driver to bus with ID ${busId}`);
    }
};

// DELETE: відкріпити водія від автобуса
export const removeDriverFromBus = async (busId) => {
    try {
        const response = await axios.delete(`${API_BASE}/${busId}/remove-driver`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || `Failed to remove driver from bus with ID ${busId}`);
    }
};

