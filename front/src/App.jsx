import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import UserHome from './pages/UserHome';
import DriverInfo from './pages/DriverInfo';
import SideBar from './components/SideBar';
import BussInfo from './pages/BussInfo';
import MapPage from './pages/MapPage';
import { LoadScript } from '@react-google-maps/api';
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from './components/AnimatedPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import { useState } from 'react';

const AppWrapper = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/';
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <AnimatePresence mode="wait">
            <div className="app-container">
                {showSidebar && <SideBar onCollapse={setIsSidebarCollapsed} />}
                <main className={`main-content ${showSidebar ? 'with-sidebar' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
                        <Route path="/admin-dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
                        <Route path="/user-home" element={<AnimatedPage><UserHome /></AnimatedPage>} />
                        <Route path="/driver-info" element={<AnimatedPage><DriverInfo /></AnimatedPage>} />
                        <Route path="/buss-info" element={<AnimatedPage><BussInfo /></AnimatedPage>} />
                        <Route path="/map-page" element={<AnimatedPage><MapPage /></AnimatedPage>} />
                    </Routes>
                </main>
            </div>
        </AnimatePresence>
    );
};

function App() {
    return (
        <AuthProvider>
            <LoadScript googleMapsApiKey="AIzaSyAantXcM4bJhW6XC6eR4-Z9hWySQQr-Nto">
                <Router>
                    <AppWrapper />
                </Router>
            </LoadScript>
        </AuthProvider>
    );
}

export default App;
