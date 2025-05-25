import React, { useState, useEffect } from 'react';
import { getDrivers } from '../../api/driver_api';
import { assignDriverToBus } from '../../api/buss_api';
import { showToast } from '../../utils/toast';

const AssignDriverModal = ({ bus, onClose, onSuccess }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const data = await getDrivers();
                setDrivers(data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };
        fetchDrivers();
    }, []);

    const handleAssign = async () => {
        if (!selectedDriver) {
            showToast.warning('Будь ласка, оберіть водія');
            return;
        }

        setLoading(true);
        try {
            await assignDriverToBus(bus.busId, selectedDriver);
            onSuccess();
            onClose();
        } catch (error) {
            showToast.error('Помилка при призначенні водія: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-content">
            <h2>Призначити водія на автобус {bus.busId}</h2>
            <select 
                value={selectedDriver} 
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="driver-select"
            >
                <option value="">Оберіть водія</option>
                {drivers.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                        {driver.name} (Досвід: {driver.experience} років)
                    </option>
                ))}
            </select>
            <div className="modal-buttons">
                <button 
                    className="button" 
                    onClick={handleAssign}
                    disabled={loading}
                >
                    {loading ? 'Призначення...' : 'Призначити'}
                </button>
                <button className="button cancel" onClick={onClose}>Скасувати</button>
            </div>
        </div>
    );
};

export default AssignDriverModal; 