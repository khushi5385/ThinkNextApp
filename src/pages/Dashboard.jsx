import React, { useState, useEffect } from 'react';

export default function Dashboard() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadData = () => {
        const storedStudents = localStorage.getItem('students');
        const storedAttendance = localStorage.getItem('attendance');
        
        if (storedStudents) setStudents(JSON.parse(storedStudents));
        if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
    };

    const calculateAttendanceRate = () => {
        const total = attendance.length;
        if (total === 0) return 0;
        const present = attendance.filter(a => a.status === 'Present').length;
        return ((present / total) * 100).toFixed(1);
    };

    const getTodayPresent = () => {
        const today = new Date().toISOString().split('T')[0];
        return attendance.filter(a => a.status === 'Present' && a.date === today).length;
    };

    const stats = [
        { icon: '👨‍🎓', title: 'Total Students', value: students.length, color: '#4f46e5' },
        { icon: '📊', title: 'Attendance Rate', value: `${calculateAttendanceRate()}%`, color: '#f59e0b' },
        { icon: '✅', title: 'Present Today', value: getTodayPresent(), color: '#ef4444' }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '32px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
                    🎓 Welcome to ThinkNEXT Technologies
                </h2>
                <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
                    Manage students and attendance efficiently
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <span><i className="far fa-calendar-alt"></i> {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span><i className="far fa-clock"></i> {currentTime.toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                        <div className="stat-title">{stat.title}</div>
                    </div>
                ))}
            </div>

            {/* Recent Students Section */}
            <div className="table-wrapper" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-users" style={{ color: '#4f46e5' }}></i> Recent Students
                </h3>
                {students.length === 0 ? (
                    <div className="empty-state" style={{ padding: '1.5rem' }}>
                        <i className="fas fa-user-slash"></i>
                        <p>No students yet. Click "Add Student" to get started!</p>
                    </div>
                ) : (
                    students.slice(0, 5).map(s => (
                        <div key={s.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#eef2ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👨‍🎓</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600' }}>{s.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.course || 'No course'}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
