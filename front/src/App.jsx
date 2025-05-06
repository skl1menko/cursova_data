import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import DispatcherPanel from './pages/DispatcherPanel';
import UserHome from './pages/UserHome';
import DriverInfo from './pages/DriverInfo';
import SideBar from './components/SideBar';
import { useEffect } from 'react';

const AppWrapper = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/';

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {showSidebar && <SideBar />}
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/dispatcher-panel" element={<DispatcherPanel />} />
                    <Route path="/user-home" element={<UserHome />} />
                    <Route path="/driver-info" element={<DriverInfo />} />
                </Routes>
            </div>
        </div>
    );
};


function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
