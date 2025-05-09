import { FaBus, FaBars } from "react-icons/fa";
import { useNavigate } from 'react-router';
import { useState } from 'react';
import '../components/SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(prev => !prev);

    return (
        <nav className="sidebar-cont">
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    {!collapsed && <h2 className="sidebar-title">Buss Info</h2>}
                </div>
                <div className="sidebar-nav-container">
                    <nav className="sidebar-nav">
                        <SidebarItem
                            icon={<FaBus className="sidebar-icon highlight-icon" />}
                            text="Buss"
                            collapsed={collapsed}
                            onClick={() => navigate('/buss-info')}
                        />
                    </nav>
                </div>
            </div>
        </nav>

    );
};

const SidebarItem = ({ icon, text, collapsed, onClick }) => (
    <div className="sidebar-item" onClick={onClick}>
        {icon}
        <span className={`sidebar-text ${collapsed ? 'hidden' : ''}`}>{text}</span>
    </div>
);

export default SideBar;
