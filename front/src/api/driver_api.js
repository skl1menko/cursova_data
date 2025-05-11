import axios from 'axios';

const API_URL = 'http://localhost:5227/api/drivers';

export const getDrivers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addDriver = async (driverData) => {
    const response = await axios.post(API_URL, {
        ...driverData,
        Schedules: []
    });
    return response.data;
};

export const updateDriver = async (driverId, driverData) => {
    const response = await axios.put(`${API_URL}/${driverId}`, driverData);
    return response.data||updateDriver;
};

export const deleteDriver = async (driverId) => {
    const response = await axios.delete(`${API_URL}/${driverId}`);
    return response.data;
};

export const getDriverAssignments = async (driverId) => {
    const response = await axios.get(`${API_URL}/${driverId}/schedules`);
    return response.data;
};
