import React, { useState, useEffect } from 'react';
import './BussInfo.css';
import { getBuss, addBus, deleteBus, updateBus, getBusStats } from '../api/buss_api';

const BussInfo = () => {
    const [buses, setBuses] = useState([]);
    const [model, setModel] = useState('');
    const [capacity, setCapacity] = useState('');
    const [year, setYear] = useState('');
    const [filters, setFilters] = useState({ model: '', capacity: '', year: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [busStats, setBusStats] = useState(null); // Додано для статистики автобуса
    const [showStats, setShowStats] = useState(false); // Стан для показу статистики

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuss();
                setBuses(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const resetForm = () => {
        setModel('');
        setCapacity('');
        setYear('');
        setSelectedBus(null);
        setShowAddForm(false);
        setShowStats(false); // Скидаємо стан статистики
    };

    const handleSaveBus = async () => {
        const busData = {
            busId: selectedBus?.busId,
            model,
            capacity: parseInt(capacity),
            year: parseInt(year),
            Schedules: []
        };
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
            alert(errorMsg.message || "Помилка при видаленні: автобус використовується в розкладі");
        }
    };

    const handleShowStats = async (id) => {
        try {
            const stats = await getBusStats(id);
            setBusStats(stats);
            setShowStats(true);
        } catch (error) {
            console.error("Error fetching bus stats:", error);
            alert("Не вдалося отримати статистику для цього автобуса.");
        }
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

            <div className="filter-group">
                <select value={filters.model} onChange={handleModelChange}>
                    <option value="">Filter by Model</option>
                    {uniqueModels.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </select>
                <input type="number" placeholder="Capacity" value={filters.capacity}
                    onChange={(e) => setFilters({ ...filters, capacity: e.target.value })} />
                <input type="number" placeholder="Year" value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
            </div>

            <div className="addbut-container">
                <button className="button add-bus-button" onClick={() => setShowAddForm(true)}>
                    ➕ Додати автобус
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Buss Num</th>
                            <th>Модель</th>
                            <th>Кількість місць</th>
                            <th>Рік</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBuses.map((bus) => (
                            <tr className="rounded-tr" key={bus.busId}>
                                <td>{bus.busId}</td>
                                <td>{bus.model}</td>
                                <td>{bus.capacity}</td>
                                <td>{bus.year}</td>
                                <td>
                                    <button className="button" onClick={() => handleEditBus(bus)}>Редагувати</button>
                                    <button className="button delete" onClick={() => handleDelete(bus.busId)}>Видалити</button>
                                    <button className="button stats" onClick={() => handleShowStats(bus.busId)}>📊 Статистика</button>
                                </td>
                            </tr>
                        ))}
                        {filteredBuses.length === 0 && (
                            <tr><td colSpan="5">Нічого не знайдено</td></tr>
                        )}
                    </tbody>
                </table>
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

            {/* Модальне вікно для статистики */}
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
                                    <h3>Розклад:</h3>
                                    {busStats.schedules.map((schedule, index) => (
                                        <div key={index}>
                                            <p><strong>Час першого відправлення:</strong> {schedule.firstDeparture}</p>
                                            <p><strong>Час останнього відправлення:</strong> {schedule.lastDeparture}</p>
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



        </div>
    );
};

export default BussInfo;
