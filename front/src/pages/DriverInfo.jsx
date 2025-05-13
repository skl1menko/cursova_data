import React, { useState, useEffect } from 'react';
import './DriverInfo.css';
import { getDrivers, addDriver, updateDriver, deleteDriver, getDriverAssignments } from '../api/driver_api';

const DriverInfo = () => {
    const [drivers, setDrivers] = useState([]);
    const [name, setName] = useState('');
    const [experience, setExperience] = useState('');
    const [license, setLicense] = useState('');
    const [filters, setFilters] = useState({ name: '', experience: '', license: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [assignments, setAssignments] = useState(null);
    const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDrivers();
                setDrivers(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const resetForm = () => {
        setName('');
        setExperience('');
        setLicense('');
        setSelectedDriver(null);
        setShowAddForm(false);
    };

    const handleSaveDriver = async () => {
        const driverData = {
            driverId: selectedDriver?.driverId,
            name,
            experience: parseInt(experience),
            license,
            Schedules: []
        };
        try {
            if (selectedDriver) {
                const updated = await updateDriver(selectedDriver.driverId, driverData);
                setDrivers(drivers.map(d => (d.driverId === updated.driverId ? updated : d)));
            } else {
                const addedDriver = await addDriver(driverData);
                setDrivers([...drivers, addedDriver]);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving driver:", error);
        }
    };

    const handleEditDriver = (driver) => {
        setName(driver.name);
        setExperience(driver.experience);
        setLicense(driver.license);
        setSelectedDriver(driver);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDriver(id);
            setDrivers(drivers.filter(driver => driver.driverId !== id));
        } catch (error) {
            alert("Помилка при видаленні: водій має активні розклади");
        }
    };

    const handleShowAssignments = async (driverId) => {
        try {
            const data = await getDriverAssignments(driverId);
            setAssignments(data);
            setShowAssignmentsModal(true);
        } catch (error) {
            console.error("Error fetching assignments:", error);
            alert("Помилка при завантаженні призначень.");
        }
    };

    const filteredDrivers = drivers.filter(driver =>
        (filters.name === '' || driver.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.experience === '' || driver.experience === parseInt(filters.experience)) &&
        (filters.license === '' || driver.license.toLowerCase().includes(filters.license.toLowerCase()))
    );

    return (
        <div className="drivers-page">
            <h1>Водії</h1>

            <div className="filter-group">
                <input type="text" placeholder="Ім'я" value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                <input type="number" placeholder="Досвід" value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })} />
                <input type="text" placeholder="Ліцензія" value={filters.license}
                    onChange={(e) => setFilters({ ...filters, license: e.target.value })} />
            </div>

            <div className="addbut-container">
                <button className="button add-driver-button" onClick={() => setShowAddForm(true)}>
                    ➕ Додати водія
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ім'я</th>
                            <th>Досвід</th>
                            <th>Ліцензія</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.map((driver) => (
                            <tr key={driver.driverId}>
                                <td>{driver.driverId}</td>
                                <td>{driver.name}</td>
                                <td>{driver.experience}</td>
                                <td>{driver.license}</td>
                                <td>
                                    <button className="button" onClick={() => handleEditDriver(driver)}>Редагувати</button>
                                    <button className="button delete" onClick={() => handleDelete(driver.driverId)}>Видалити</button>
                                    <button className="button assignments" onClick={() => handleShowAssignments(driver.driverId)}>📋 Призначення</button>
                                </td>
                            </tr>
                        ))}
                        {filteredDrivers.length === 0 && (
                            <tr><td colSpan="4">Нічого не знайдено</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedDriver ? "Редагувати водія" : "Додати нового водія"}</h2>
                        <input type="text" placeholder="Ім'я" value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <input type="number" placeholder="Досвід" value={experience}
                            onChange={(e) => setExperience(e.target.value)} />
                        <input type="text" placeholder="Ліцензія" value={license}
                            onChange={(e) => setLicense(e.target.value)} />
                        <div className="modal-buttons">
                            <button className="button" onClick={handleSaveDriver}>
                                {selectedDriver ? "Зберегти" : "Додати"}
                            </button>
                            <button className="button cancel" onClick={resetForm}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignmentsModal && assignments && assignments.length > 0 && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Призначення водія</h2>
                        <ul>
                            {assignments.map((assignment, index) => (
                                <li key={index}>{`Маршрут: ${assignment.scheduleId}, Час відправлення: ${assignment.departureTime}`}</li>
                            ))}
                        </ul>
                        <div className="modal-buttons">
                            <button className="button cancel" onClick={() => setShowAssignmentsModal(false)}>Закрити</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DriverInfo;
