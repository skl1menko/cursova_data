import { BrowserRouter as Router, Routes, Route } from 'react-router';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import DispatcherPanel from './pages/DispatcherPanel';
import UserHome from './pages/UserHome';
import DriverInfo from './pages/DriverInfo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/dispatcher-panel" element={<DispatcherPanel />} />
                <Route path="/user-home" element={<UserHome />} />
                <Route path="/driver-info" element={<DriverInfo />} />
            </Routes>
        </Router>
    );
}

export default App;
