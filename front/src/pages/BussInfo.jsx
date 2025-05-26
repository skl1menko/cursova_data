import React, { useState, useEffect } from 'react';
import './BussInfo.css';
import { getBuss, addBus, deleteBus, updateBus, getBusStats, assignDriverToBus, removeDriverFromBus } from '../api/buss_api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { showToast } from '../utils/toast';
import { useLocation } from 'react-router';
import BussFilter from '../components/BussInfoPage/BussFilter';
import AddBussBut from '../components/BussInfoPage/AddBussBut';
const BussInfo = () => {
    const location = useLocation();
    const [buses, setBuses] = useState([]);
    const [model, setModel] = useState('');
    const [capacity, setCapacity] = useState('');
    const [year, setYear] = useState('');
    const [filters, setFilters] = useState({ model: '', capacity: '', year: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [busStats, setBusStats] = useState(null); // Додано для статистики автобуса
    const [showStats, setShowStats] = useState(false); // Стан для показу статистики
    const [showAssignDriver, setShowAssignDriver] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [busesData, driversData] = await Promise.all([
                    getBuss(),
                    axios.get('http://localhost:5227/api/drivers')
                ]);
                // Завантажуємо статистику для кожного автобуса, щоб отримати інформацію про водіїв
                const busesWithSchedules = await Promise.all(
                    busesData.map(async (bus) => {
                        try {
                            const stats = await getBusStats(bus.busId);
                            return {
                                ...bus,
                                Schedules: stats.schedules || []
                            };
                        } catch (error) {
                            console.error(`Error fetching stats for bus ${bus.busId}:`, error);
                            return bus;
                        }
                    })
                );
                setBuses(busesWithSchedules);
                setDrivers(driversData.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Check URL parameters for showAddForm
        const params = new URLSearchParams(location.search);
        if (params.get('showAddForm') === 'true') {
            setShowAddForm(true);
        }
    }, [location]);

    const resetForm = () => {
        setModel('');
        setCapacity('');
        setYear('');
        setSelectedBus(null);
        setShowAddForm(false);
        setShowStats(false); // Скидаємо стан статистики
    };

    const handleSaveBus = async () => {
        if (!model || !capacity || !year) {
            showToast.warning('Будь ласка, заповніть всі поля');
            return;
        }

        const busData = selectedBus ? {
            busId: selectedBus.busId,
            model,
            capacity: parseInt(capacity),
            year: parseInt(year),
            Routes: selectedBus.Routes || [],
            Schedules: selectedBus.Schedules || []
        } : {
            model,
            capacity: parseInt(capacity),
            year: parseInt(year),
            Routes: [],
            Schedules: []
        };

        console.log('Sending bus data:', busData);

        try {
            if (selectedBus) {
                const updated = await updateBus(selectedBus.busId, busData);
                setBuses(buses.map(b => (b.busId === updated.busId ? updated : b)));
            } else {
                const addedBus = await addBus(busData);
                setBuses([...buses, addedBus]);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving bus:", error);
            showToast.error('Помилка при збереженні автобуса: ' + (error.message || 'Невідома помилка'));
        }
    };

    const handleEditBus = (bus) => {
        setModel(bus.model);
        setCapacity(bus.capacity);
        setYear(bus.year);
        setSelectedBus(bus);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteBus(id);
            setBuses(buses.filter(bus => bus.busId !== id));
        } catch (error) {
            const errorMsg = JSON.parse(error.message);
            showToast.error(errorMsg.message || "Помилка при видаленні: автобус використовується в розкладі");
        }
    };

    const handleShowStats = async (id) => {
        try {
            const stats = await getBusStats(id);
            setBusStats(stats);
            setShowStats(true);
        } catch (error) {
            console.error("Error fetching bus stats:", error);
            showToast.error("Не вдалося отримати статистику для цього автобуса.");
        }
    };

    const handleAssignDriver = async (busId) => {
        try {
            if (!selectedDriver) {
                // Якщо вибрано пусте значення, відкріплюємо водія
                await removeDriverFromBus(busId);
                showToast.success('Водія успішно відкріплено від автобуса');
            } else {
                const driverId = parseInt(selectedDriver);
                if (isNaN(driverId)) {
                    showToast.error('Невірний ID водія');
                    return;
                }

                await assignDriverToBus(busId, driverId);
                showToast.success('Водія успішно призначено до автобуса');
            }
            
            setShowAssignDriver(false);
            setSelectedDriver('');
            
            // Оновлюємо список автобусів
            const updatedBuses = await Promise.all(
                buses.map(async (bus) => {
                    if (bus.busId === busId) {
                        try {
                            const stats = await getBusStats(busId);
                            return {
                                ...bus,
                                Schedules: stats.schedules || []
                            };
                        } catch (error) {
                            console.error(`Error fetching stats for bus ${busId}:`, error);
                            return bus;
                        }
                    }
                    return bus;
                })
            );
            setBuses(updatedBuses);
            
            // Refresh bus stats if they are currently shown
            if (showStats && busStats && busStats.busId === busId) {
                const stats = await getBusStats(busId);
                setBusStats(stats);
            }
        } catch (error) {
            console.error("Error handling driver assignment:", error);
            showToast.error('Помилка: ' + (error.message || 'Невідома помилка'));
        }
    };

    // Функція для отримання поточного водія автобуса
    const getCurrentDriver = (bus) => {
        if (bus.Schedules && bus.Schedules.length > 0) {
            const schedule = bus.Schedules[0];
            if (schedule.driver) {
                return schedule.driver.driverId.toString();
            }
        }
        return '';
    };

  

    const filteredBuses = buses.filter(bus =>
        (filters.model === '' || bus.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (filters.capacity === '' || bus.capacity === parseInt(filters.capacity)) &&
        (filters.year === '' || bus.year === parseInt(filters.year))
    );

    const handleModelChange = (e) => {
        setFilters({ ...filters, model: e.target.value });
    };

    const uniqueModels = [...new Set(buses.map(bus => bus.model))];

    return (
        <div className="buses-page">
            <h1>Автобуси</h1>

            <BussFilter filters={filters} setFilters={setFilters} uniqueModels={uniqueModels} handleModelChange={handleModelChange} />
            
            {userRole === 'admin' && (
                <AddBussBut setShowAddForm={setShowAddForm} />
                
            )}

            <div className="buses-grid">
                {filteredBuses.map((bus) => (
                    <div className="bus-card" key={bus.busId}>
                        {userRole === 'admin' && (
                            <button className="delete-cross" onClick={() => handleDelete(bus.busId)}>
                                ✕
                            </button>
                        )}
                        <div className="bus-card-header">
                            <h3>Автобус #{bus.busId}</h3>
                        </div>
                        <div className="bus-card-content">
                            <div className="bus-info-item">
                                <span className="info-label">Модель:</span>
                                <span className="info-value">{bus.model}</span>
                            </div>
                            <div className="bus-info-item">
                                <span className="info-label">Місткість:</span>
                                <span className="info-value">{bus.capacity} місць</span>
                            </div>
                            <div className="bus-info-item">
                                <span className="info-label">Рік випуску:</span>
                                <span className="info-value">{bus.year}</span>
                            </div>
                            {bus.Schedules && bus.Schedules.length > 0 && bus.Schedules[0].driver && (
                                <div className="bus-info-item">
                                    <span className="info-label">Водій:</span>
                                    <span className="info-value">{bus.Schedules[0].driver.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="bus-card-actions">
                            {userRole === 'admin' && (
                                <>
                                    <button className="button edit" onClick={() => handleEditBus(bus)}>
                                        ✏️ Редагувати
                                    </button>
                                    <button className="button assign" onClick={() => {
                                        setSelectedBus(bus);
                                        setShowAssignDriver(true);
                                    }}>
                                        👤 Призначити водія
                                    </button>
                                </>
                            )}
                            <button className="button stats" onClick={() => handleShowStats(bus.busId)}>
                                📊 Статистика
                            </button>
                        </div>
                    </div>
                ))}
                {filteredBuses.length === 0 && (
                    <div className="no-buses">Автобуси не знайдено</div>
                )}
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedBus ? "Редагувати автобус" : "Додати новий автобус"}</h2>
                        <select value={model} onChange={(e) => setModel(e.target.value)}>
                            <option value="">Оберіть модель</option>
                            {uniqueModels.map((model, index) => (
                                <option key={index} value={model}>{model}</option>
                            ))}
                        </select>
                        <input type="number" placeholder="Кількість місць" value={capacity}
                            onChange={(e) => setCapacity(e.target.value)} />
                        <input type="number" placeholder="Рік випуску" value={year}
                            onChange={(e) => setYear(e.target.value)} />
                        <div className="modal-buttons">
                            <button className="button" onClick={handleSaveBus}>
                                {selectedBus ? "Зберегти" : "Додати"}
                            </button>
                            <button className="button cancel" onClick={resetForm}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}

            {showStats && busStats && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Статистика автобуса</h2>
                        <div className="bus-stats">
                            <p><strong>Номер автобуса:</strong> {busStats.busId}</p>
                            {busStats.routes && busStats.routes.length > 0 ? (
                                <div>
                                    <h3>Маршрути:</h3>
                                    {busStats.routes.map((route, index) => (
                                        <div key={index}>
                                            <p><strong>Номер маршруту:</strong> {route.routeNumber}</p>
                                            <p><strong>Кількість зупинок:</strong> {route.stopCount}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Маршрути не знайдені.</p>
                            )}
                            {busStats.schedules && busStats.schedules.length > 0 ? (
                                <div>
                                    <h3>Розклад та водії:</h3>
                                    {busStats.schedules.map((schedule, index) => (
                                        <div key={index} className="schedule-item">
                                            <p><strong>Час першого відправлення:</strong> {schedule.firstDeparture}</p>
                                            <p><strong>Час останнього відправлення:</strong> {schedule.lastDeparture}</p>
                                            {schedule.driver ? (
                                                <div className="driver-info">
                                                    <h4>Водій:</h4>
                                                    <p><strong>Ім'я:</strong> {schedule.driver.name}</p>
                                                    <p><strong>Ліцензія:</strong> {schedule.driver.license}</p>
                                                    <p><strong>Досвід:</strong> {schedule.driver.experience} років</p>
                                                </div>
                                            ) : (
                                                <p>Водій не призначений</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Розклад не знайдено.</p>
                            )}
                        </div>
                        <button className="button cancel" onClick={resetForm}>Закрити</button>
                    </div>
                </div>
            )}

            {showAssignDriver && selectedBus && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Призначити водія до автобуса {selectedBus.busId}</h2>
                        <select 
                            value={selectedDriver || getCurrentDriver(selectedBus)} 
                            onChange={(e) => setSelectedDriver(e.target.value)}
                            className="driver-select"
                        >
                            <option value="">Оберіть водія</option>
                            {drivers.map((driver) => (
                                <option key={driver.driverId} value={driver.driverId}>
                                    {driver.name} (Ліцензія: {driver.license})
                                </option>
                            ))}
                        </select>
                        <div className="modal-buttons">
                            <button 
                                className="button" 
                                onClick={() => handleAssignDriver(selectedBus.busId)}
                            >
                                {selectedDriver || getCurrentDriver(selectedBus) ? 'Змінити водія' : 'Призначити'}
                            </button>
                            <button 
                                className="button cancel" 
                                onClick={() => {
                                    setShowAssignDriver(false);
                                    setSelectedDriver('');
                                }}
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BussInfo;
