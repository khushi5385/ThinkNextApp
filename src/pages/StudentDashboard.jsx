import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [courses, setCourses] = useState([]);
    const [attendanceNotes, setAttendanceNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const studentAttendance = storedAttendance.filter(a => a.studentId === user?.id);
        setAttendance(studentAttendance);

        const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
        setCourses(storedCourses);

        const storedNotes = JSON.parse(localStorage.getItem('attendanceNotes') || '[]');
        setAttendanceNotes(storedNotes);
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
    const studentCourse = courses.find(c => c.name === user?.course);

    const categories = [
        { id: 'all', name: 'All Courses', icon: '📚' },
        { id: 'engineering', name: 'Engineering', icon: '🔧' },
        { id: 'technical', name: 'Technical / IT', icon: '💻' }
    ];

    const filteredCourses = courses.filter(course => {
        const matchCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchSearch = searchTerm === '' ||
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

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

            {/* Tabs */}
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
                <button
                    onClick={() => setActiveTab('mycourse')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'mycourse' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'mycourse' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-user-graduate"></i> My Course
                </button>
                <button
                    onClick={() => setActiveTab('allcourses')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'allcourses' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'allcourses' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                  
                    <i className="fas fa-sticky-note"></i> Announcements
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

            {/* My Course Tab */}
            {activeTab === 'mycourse' && studentCourse && (
                <div className="course-card" style={{ maxWidth: '100%' }}>
                    <div className="course-header" style={{ background: `linear-gradient(135deg, ${studentCourse.color || '#4f46e5'}, ${studentCourse.color || '#7c3aed'})` }}>
                        <h3 style={{ fontSize: '1.3rem' }}>
                            <span style={{ fontSize: '2rem', marginRight: '10px' }}>{studentCourse.icon || '📚'}</span>
                            {studentCourse.name}
                        </h3>
                    </div>
                    <div className="course-body">
                        <div className="course-info">
                            <i className="fas fa-code"></i>
                            <span><strong>Course Code:</strong> {studentCourse.code}</span>
                        </div>
                        <div className="course-info">
                            <i className="fas fa-chalkboard-user"></i>
                            <span><strong>Instructor:</strong> {studentCourse.instructor}</span>
                        </div>
                        <div className="course-info">
                            <i className="fas fa-clock"></i>
                            <span><strong>Duration:</strong> {studentCourse.duration}</span>
                        </div>
                        <div className="course-info">
                            <i className="fas fa-graduation-cap"></i>
                            <span><strong>Level:</strong> {studentCourse.level || 'Professional'}</span>
                        </div>
                        <div className="course-info">
                            <i className="fas fa-credit-card"></i>
                            <span><strong>Fees:</strong> {studentCourse.fees}</span>
                        </div>
                        <div className="course-info">
                            <i className="fas fa-users"></i>
                            <span><strong>Seats Available:</strong> {studentCourse.seats || 'N/A'}</span>
                        </div>
                        <div className="course-info" style={{ alignItems: 'flex-start' }}>
                            <i className="fas fa-info-circle"></i>
                            <span><strong>Description:</strong> {studentCourse.description}</span>
                        </div>
                        {studentCourse.topics && (
                            <div style={{ marginTop: '1rem' }}>
                                <div className="course-info">
                                    <i className="fas fa-tags"></i>
                                    <span><strong>Topics Covered:</strong></span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '34px', marginTop: '8px' }}>
                                    {studentCourse.topics.map((topic, idx) => (
                                        <span key={idx} style={{
                                            background: '#f3e8ff',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            color: '#7c3aed'
                                        }}>
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* All Courses Tab - Show all available courses */}
            {activeTab === 'allcourses' && (
                <div>
                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '12px', color: '#9ca3af' }}></i>
                            <input
                                type="text"
                                placeholder="Search courses by name or instructor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 20px 10px 44px',
                                    borderRadius: '40px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div style={{
                        display: 'flex',
                        gap: '0.8rem',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '6px 20px',
                                    borderRadius: '40px',
                                    border: selectedCategory === cat.id ? 'none' : '2px solid #e5e7eb',
                                    background: selectedCategory === cat.id ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'white',
                                    color: selectedCategory === cat.id ? 'white' : '#4f46e5',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Courses Grid */}
                    {filteredCourses.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-search"></i>
                            <p>No courses found</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {filteredCourses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="course-header" style={{ background: `linear-gradient(135deg, ${course.color || '#4f46e5'}, ${course.color || '#7c3aed'}dd)` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                                <span style={{ fontSize: '1.4rem' }}>{course.icon || '📚'}</span>
                                                {course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name}
                                            </h3>
                                            {course.name === user?.course && (
                                                <span style={{
                                                    background: '#10b981',
                                                    padding: '2px 8px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.6rem',
                                                    fontWeight: '600',
                                                    color: 'white'
                                                }}>
                                                    Enrolled
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="course-body">
                                        <div className="course-info">
                                            <i className="fas fa-chalkboard-user"></i>
                                            <span><strong>Instructor:</strong> {course.instructor}</span>
                                        </div>
                                        <div className="course-info">
                                            <i className="fas fa-clock"></i>
                                            <span><strong>Duration:</strong> {course.duration}</span>
                                        </div>
                                        <div className="course-info">
                                            <i className="fas fa-graduation-cap"></i>
                                            <span><strong>Level:</strong> {course.level || 'Professional'}</span>
                                        </div>
                                        <div className="course-info">
                                            <i className="fas fa-credit-card"></i>
                                            <span><strong>Fees:</strong> {course.fees}</span>
                                        </div>
                                        <div className="course-info" style={{ alignItems: 'flex-start' }}>
                                            <i className="fas fa-info-circle"></i>
                                            <span><strong>Description:</strong> {course.description.length > 80 ? course.description.substring(0, 80) + '...' : course.description}</span>
                                        </div>
                                        {course.topics && (
                                            <div style={{ marginTop: '10px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {course.topics.slice(0, 3).map((topic, idx) => (
                                                        <span key={idx} style={{
                                                            background: '#f3e8ff',
                                                            padding: '2px 8px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.65rem',
                                                            color: '#7c3aed'
                                                        }}>
                                                            {topic}
                                                        </span>
                                                    ))}
                                                    {course.topics.length > 3 && (
                                                        <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>+{course.topics.length - 3}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Announcements/Notes Tab */}
            {activeTab === 'notes' && (
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600' }}>Filter by Month: </label>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {attendanceNotes.filter(n => n.month === selectedMonth).length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-sticky-note"></i>
                                <p>No announcements for this month</p>
                            </div>
                        ) : (
                            attendanceNotes.filter(n => n.month === selectedMonth).map(note => (
                                <div key={note.id} style={{
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    padding: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                        <i className="fas fa-bullhorn" style={{ color: '#4f46e5' }}></i>
                                        <span style={{ fontWeight: '600' }}>{note.author}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                            {new Date(note.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: '#374151', lineHeight: '1.5' }}>{note.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
