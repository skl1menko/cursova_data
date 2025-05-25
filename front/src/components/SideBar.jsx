import { FaBus, FaBars, FaRegAddressCard, FaSignOutAlt } from "react-icons/fa";
import { GrMap } from "react-icons/gr";
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import '../components/SideBar.css';

const SideBar = ({ onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        onCollapse(newState);
    };

    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('user');
        // Navigate to login page
        navigate('/');
    };

    const mainMenuItems = [
        {
            icon: <FaBus className="sidebar-icon highlight-icon" />,
            text: "Buss",
            path: '/buss-info'
        },
        {
            icon: <FaRegAddressCard className="sidebar-icon highlight-icon" />,
            text: "Driver",
            path: '/driver-info'
        },
        {
            icon: <GrMap className="sidebar-icon highlight-icon" />,
            text: "Map",
            path: '/map-page'
        }
    ];

    const bottomMenuItems = [
        {
            icon: <FaSignOutAlt className="sidebar-icon highlight-icon" />,
            text: "Logout",
            onClick: handleLogout
        }
    ];

    return (
        <nav className="sidebar-cont">
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
                        <FaBars />
                    </button>
                    {!collapsed && <h2 className="sidebar-title">Buss Info</h2>}
                </div>
                <div className="sidebar-nav-container">
                    <nav className="sidebar-nav">
                        {mainMenuItems.map((item, index) => (
                            <SidebarItem
                                key={index}
                                icon={item.icon}
                                text={item.text}
                                collapsed={collapsed}
                                active={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </nav>
                    <nav className="sidebar-nav bottom-nav">
                        {bottomMenuItems.map((item, index) => (
                            <SidebarItem
                                key={index}
                                icon={item.icon}
                                text={item.text}
                                collapsed={collapsed}
                                onClick={item.onClick}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </nav>
    );
};

const SidebarItem = ({ icon, text, collapsed, active, onClick }) => (
    <div
        className={`sidebar-item ${active ? 'active' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
        {icon}
        <span className={`sidebar-text ${collapsed ? 'hidden' : ''}`}>{text}</span>
    </div>
);

export default SideBar;
