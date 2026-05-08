import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const path = location.pathname;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="navbar">
            <div className="nav-container">
                <div className="logo">
                    <span>🎓</span>
                    <span>ThinkNEXT Technologies</span>
                </div>
                <div className="nav-links">
                    <Link to="/admin/dashboard" className={`nav-link ${path === '/admin/dashboard' ? 'active' : ''}`}>
                        <i className="fas fa-chart-line"></i> Dashboard
                    </Link>
                    <Link to="/admin/students" className={`nav-link ${path === '/admin/students' ? 'active' : ''}`}>
                        <i className="fas fa-users"></i> Students
                    </Link>
                    <Link to="/admin/attendance" className={`nav-link ${path === '/admin/attendance' ? 'active' : ''}`}>
                        <i className="fas fa-calendar-check"></i> Attendance
                    </Link>
                    <button onClick={handleLogout} className="nav-link" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer' }}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
