import { useState, useEffect } from 'react';
import { getBuss } from '../api/buss_api';
import { getDrivers } from '../api/driver_api';
import { fetchAllRoutes } from '../api/route-api';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        buses: 0,
        drivers: 0,
        routes: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [buses, drivers, routes] = await Promise.all([
                    getBuss(),
                    getDrivers(),
                    fetchAllRoutes()
                ]);

                setStats({
                    buses: buses.length,
                    drivers: drivers.length,
                    routes: routes.length,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stats-card stagger-item">
                    <div className="icon-wrapper">
                        <i className="fas fa-bus"></i>
                    </div>
                    <h3 className="stats-title">Total Buses</h3>
                    <div className="stats-number">{stats.buses}</div>
                    <p className="stats-description">Active vehicles in the fleet</p>
                </div>

                <div className="stats-card stagger-item">
                    <div className="icon-wrapper">
                        <i className="fas fa-user"></i>
                    </div>
                    <h3 className="stats-title">Active Drivers</h3>
                    <div className="stats-number">{stats.drivers}</div>
                    <p className="stats-description">Professional drivers on duty</p>
                </div>

                <div className="stats-card stagger-item">
                    <div className="icon-wrapper">
                        <i className="fas fa-route"></i>
                    </div>
                    <h3 className="stats-title">Total Routes</h3>
                    <div className="stats-number">{stats.routes}</div>
                    <p className="stats-description">Active routes in the network</p>
                </div>
            </div>

            {userRole === 'admin' && (
                <section className="quick-actions-section">
                    <h2 className="quick-actions-title">Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <button 
                            className="quick-action-button"
                            onClick={() => navigate('/buss-info?showAddForm=true')}
                        >
                            <i className="fas fa-plus"></i>
                            Add New Bus
                        </button>
                        <button 
                            className="quick-action-button"
                            onClick={() => navigate('/driver-info?showAddForm=true')}
                        >
                            <i className="fas fa-plus"></i>
                            Add New Driver
                        </button>
                    </div>
                </section>
            )}

            <section className="preview-section">
                <h2 className="quick-actions-title">Quick Access</h2>
                <div className="preview-grid">
                    <div className="preview-card" onClick={() => navigate('/buss-info')}>
                        <div className="preview-card-content">
                            <div className="preview-card-icon">
                                <i className="fas fa-bus"></i>
                            </div>
                            <h3 className="preview-card-title">Buses</h3>
                        </div>
                        <p className="preview-card-description">
                            Click to view buses management page
                        </p>
                    </div>

                    <div className="preview-card" onClick={() => navigate('/driver-info')}>
                        <div className="preview-card-content">
                            <div className="preview-card-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <h3 className="preview-card-title">Drivers</h3>
                        </div>
                        <p className="preview-card-description">
                            Click to view drivers management page
                        </p>
                    </div>

                    <div className="preview-card" onClick={() => navigate('/map-page')}>
                        <div className="preview-card-content">
                            <div className="preview-card-icon">
                                <i className="fas fa-route"></i>
                            </div>
                            <h3 className="preview-card-title">Map</h3>
                        </div>
                        <p className="preview-card-description">
                            Click to view map and routes management
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
