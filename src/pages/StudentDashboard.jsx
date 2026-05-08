import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const studentAttendance = storedAttendance.filter(a => a.studentId === user?.id);
        setAttendance(studentAttendance);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getMonthlyStats = () => {
        const monthAttendance = attendance.filter(a => a.date.startsWith(selectedMonth));
        const totalDays = [...new Set(monthAttendance.map(a => a.date))].length;
        const presentDays = monthAttendance.filter(a => a.status === 'Present').length;
        const absentDays = monthAttendance.filter(a => a.status === 'Absent').length;
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

        return { totalDays, presentDays, absentDays, percentage };
    };

    const getOverallStats = () => {
        const totalDays = [...new Set(attendance.map(a => a.date))].length;
        const presentDays = attendance.filter(a => a.status === 'Present').length;
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

        return { totalDays, presentDays, percentage };
    };

    const monthlyStats = getMonthlyStats();
    const overallStats = getOverallStats();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '3rem' }}>{user?.avatar}</span>
                            <div>
                                <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user?.name}!</h1>
                                <p style={{ opacity: 0.9 }}>Student Portal - {user?.course}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '40px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: '#eef2ff' }}>📊</div>
                        <div className="stat-value">{overallStats.percentage}%</div>
                    </div>
                    <div className="stat-title">Overall Attendance</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
                        <div className="stat-value" style={{ color: '#10b981' }}>{overallStats.presentDays}</div>
                    </div>
                    <div className="stat-title">Days Present</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: '#fee2e2' }}>📅</div>
                        <div className="stat-value" style={{ color: '#dc2626' }}>{overallStats.totalDays}</div>
                    </div>
                    <div className="stat-title">Total Days</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: '#fef3c7' }}>🎓</div>
                        <div className="stat-value" style={{ color: '#d97706' }}>{user?.enrollmentNo || 'N/A'}</div>
                    </div>
                    <div className="stat-title">Enrollment No</div>
                </div>
            </div>

            {/* Tabs - Only Overview and Attendance History */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'overview' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'overview' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-chart-line"></i> Overview
                </button>
                <button
                    onClick={() => setActiveTab('attendance')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'attendance' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'attendance' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-calendar-check"></i> Attendance History
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600' }}>Select Month: </label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '40px',
                                border: '2px solid #e5e7eb',
                                marginLeft: '1rem'
                            }}
                        />
                    </div>

                    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">📅</div>
                                <div className="stat-value">{monthlyStats.totalDays}</div>
                            </div>
                            <div className="stat-title">Working Days</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">✅</div>
                                <div className="stat-value" style={{ color: '#10b981' }}>{monthlyStats.presentDays}</div>
                            </div>
                            <div className="stat-title">Present</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">❌</div>
                                <div className="stat-value" style={{ color: '#dc2626' }}>{monthlyStats.absentDays}</div>
                            </div>
                            <div className="stat-title">Absent</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">📊</div>
                                <div className="stat-value">{monthlyStats.percentage}%</div>
                            </div>
                            <div className="stat-title">Monthly Percentage</div>
                        </div>
                    </div>

                    {monthlyStats.percentage < 75 && monthlyStats.totalDays > 0 && (
                        <div style={{
                            background: '#fef3c7',
                            padding: '1rem',
                            borderRadius: '16px',
                            color: '#92400e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem' }}></i>
                            <div>
                                <strong>Low Attendance Alert!</strong>
                                <p style={{ margin: 0, fontSize: '0.85rem' }}>Your attendance is below 75%. Please attend classes regularly.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Attendance History Tab */}
            {activeTab === 'attendance' && (
                <div className="attendance-container">
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>No attendance records found</td>
                                    </tr>
                                ) : (
                                    [...attendance].reverse().map(record => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td>{new Date(record.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
