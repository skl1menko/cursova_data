import React, { useState, useEffect } from 'react';
import './DriverInfo.css';
import { getDrivers, addDriver, updateDriver, deleteDriver, getDriverAssignments } from '../api/driver_api';
import DriverFilter from '../components/DriverInfoPage/DriverFilter';
import AddDriverBut from '../components/DriverInfoPage/AddDriverBut';
import DriverTable from '../components/DriverInfoPage/DriverTable';
import AddDriverForm from '../components/DriverInfoPage/AddDriverForm';
import DriverInfoForm from '../components/DriverInfoPage/DriverInfoForm';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { useLocation } from 'react-router';

const DriverInfo = () => {
    const location = useLocation();
    const [drivers, setDrivers] = useState([]);
    const [name, setName] = useState('');
    const [experience, setExperience] = useState('');
    const [license, setLicense] = useState('');
    const [filters, setFilters] = useState({ name: '', experience: '', license: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [assignments, setAssignments] = useState(null);
    const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
    const { userRole } = useAuth();

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('showAddForm') === 'true') {
            setShowAddForm(true);
        }
    }, [location]);

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
            showToast.error("Помилка при видаленні: водій має активні розклади");
        }
    };

    const handleShowAssignments = async (driverId) => {
        try {
            const data = await getDriverAssignments(driverId);
            setAssignments(data);
            setShowAssignmentsModal(true);
        } catch (error) {
            console.error("Error fetching assignments:", error);
            showToast.error("Помилка при завантаженні призначень.");
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
            <DriverFilter filters={filters} setFilters={setFilters} />
            {userRole === 'admin' && <AddDriverBut setShowAddForm={setShowAddForm} />}
            
            <div className="drivers-grid">
                {filteredDrivers.map((driver) => (
                    <DriverTable 
                    driver={driver}
                    userRole={userRole}
                    handleEditDriver={handleEditDriver}
                    handleDelete={handleDelete}
                    handleShowAssignments={handleShowAssignments}
                    />
                ))}
                {filteredDrivers.length === 0 && (
                    <div className="no-drivers">Водіїв не знайдено</div>
                )}
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <AddDriverForm
                        selectedDriver={selectedDriver}
                        name={name}
                        experience={experience}
                        license={license}
                        handleSaveDriver={handleSaveDriver}
                        resetForm={resetForm}
                        setName={setName}
                        setExperience={setExperience}
                        setLicense={setLicense}
                    />
                </div>
            )}

            {showAssignmentsModal && assignments && assignments.length > 0 && (
                <div className="modal-overlay">
                    <DriverInfoForm
                        assignments={assignments}
                        setShowAssignmentsModal={setShowAssignmentsModal}
                    />
                </div>
            )}
        </div>
    );
};

export default DriverInfo;
