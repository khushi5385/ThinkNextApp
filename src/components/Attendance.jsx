import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [attendanceNotes, setAttendanceNotes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('daily');
    const [noteText, setNoteText] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedStudents = localStorage.getItem('students');
        const storedAttendance = localStorage.getItem('attendance');
        const storedNotes = localStorage.getItem('attendanceNotes');

        if (storedStudents) setStudents(JSON.parse(storedStudents));
        if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
        if (storedNotes) setAttendanceNotes(JSON.parse(storedNotes));
        setLoading(false);
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const markAttendance = (studentId, status) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const existingIndex = attendance.findIndex(
            a => a.studentId === studentId && a.date === selectedDate
        );

        let newAttendance;
        if (existingIndex !== -1) {
            newAttendance = [...attendance];
            newAttendance[existingIndex] = {
                ...newAttendance[existingIndex],
                status,
                studentName: student.name,
                timestamp: new Date().toISOString()
            };
        } else {
            newAttendance = [...attendance, {
                id: Date.now(),
                studentId,
                studentName: student.name,
                course: student.course,
                date: selectedDate,
                status,
                timestamp: new Date().toISOString()
            }];
        }

        setAttendance(newAttendance);
        localStorage.setItem('attendance', JSON.stringify(newAttendance));
        showAlert(`${student.name} marked as ${status}`, 'success');
    };

    const getStatus = (studentId, date = selectedDate) => {
        const record = attendance.find(a => a.studentId === studentId && a.date === date);
        return record?.status || null;
    };

    const getMonthlyStats = () => {
        const monthAttendance = attendance.filter(a => a.date.startsWith(selectedMonth));
        const stats = students.map(student => {
            const studentRecords = monthAttendance.filter(a => a.studentId === student.id);
            const totalDays = [...new Set(studentRecords.map(a => a.date))].length;
            const presentDays = studentRecords.filter(a => a.status === 'Present').length;
            const absentDays = studentRecords.filter(a => a.status === 'Absent').length;
            const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

            return {
                ...student,
                totalDays,
                presentDays,
                absentDays,
                percentage
            };
        });

        return stats;
    };

    const getAttendanceSummary = () => {
        const total = students.length;
        const present = students.filter(s => getStatus(s.id) === 'Present').length;
        const absent = students.filter(s => getStatus(s.id) === 'Absent').length;
        const notMarked = total - present - absent;
        return { total, present, absent, notMarked };
    };

    const exportToExcel = () => {
        const monthlyStats = getMonthlyStats();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [year, month] = selectedMonth.split('-');
        const monthName = monthNames[parseInt(month) - 1];

        const exportData = monthlyStats.map((stat, idx) => ({
            'S.No': idx + 1,
            'Student Name': stat.name,
            'Enrollment No': stat.enrollmentNo || '-',
            'Course': stat.course,
            'Total Working Days': stat.totalDays,
            'Present Days': stat.presentDays,
            'Absent Days': stat.absentDays,
            'Attendance Percentage': `${stat.percentage}%`,
            'Status': stat.percentage >= 75 ? 'Good Standing' : stat.percentage >= 60 ? 'Needs Improvement' : 'At Risk'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance_${monthName}_${year}`);

        XLSX.writeFile(workbook, `Attendance_Report_${monthName}_${year}.xlsx`);
        showAlert(`Attendance report for ${monthName} ${year} exported successfully!`, 'success');
    };

    const exportDailyReport = () => {
        const dailyAttendance = students.map((student, idx) => {
            const status = getStatus(student.id);
            return {
                'S.No': idx + 1,
                'Student Name': student.name,
                'Enrollment No': student.enrollmentNo || '-',
                'Course': student.course,
                'Status': status || 'Not Marked',
                'Date': selectedDate
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dailyAttendance);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Daily_Attendance_${selectedDate}`);
        XLSX.writeFile(workbook, `Daily_Attendance_${selectedDate}.xlsx`);
        showAlert(`Daily attendance for ${selectedDate} exported successfully!`, 'success');
    };

    const addNote = () => {
        if (!noteText.trim()) {
            showAlert('Please enter a note', 'error');
            return;
        }

        const newNote = {
            id: Date.now(),
            text: noteText,
            date: new Date().toISOString(),
            month: selectedMonth,
            author: 'Admin'
        };

        const updatedNotes = editingNote
            ? attendanceNotes.map(n => n.id === editingNote.id ? { ...n, text: noteText, editedAt: new Date().toISOString() } : n)
            : [newNote, ...attendanceNotes];

        setAttendanceNotes(updatedNotes);
        localStorage.setItem('attendanceNotes', JSON.stringify(updatedNotes));
        setNoteText('');
        setEditingNote(null);
        showAlert(editingNote ? 'Note updated!' : 'Note added!', 'success');
    };

    const deleteNote = (id) => {
        if (window.confirm('Delete this note?')) {
            const updatedNotes = attendanceNotes.filter(n => n.id !== id);
            setAttendanceNotes(updatedNotes);
            localStorage.setItem('attendanceNotes', JSON.stringify(updatedNotes));
            showAlert('Note deleted!', 'success');
        }
    };

    const editNote = (note) => {
        setNoteText(note.text);
        setEditingNote(note);
    };

    const getMonthlyNotes = () => {
        return attendanceNotes.filter(n => n.month === selectedMonth);
    };

    const summary = getAttendanceSummary();
    const monthlyStats = getMonthlyStats();

    if (loading) {
        return (
            <div className="empty-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading attendance data...</p>
            </div>
        );
    }

    return (
        <div>
            {alert && (
                <div className={`alert alert-${alert.type}`}>
                    <i className={alert.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
                    {alert.message}
                </div>
            )}

            <div className="page-header">
                <h1 className="page-title">
                    <i className="fas fa-clipboard-list"></i>
                    Attendance Management
                </h1>
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
                    onClick={() => setActiveTab('daily')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'daily' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'daily' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <i className="fas fa-calendar-day"></i> Daily Attendance
                </button>
                <button
                    onClick={() => setActiveTab('monthly')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'monthly' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'monthly' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <i className="fas fa-calendar-alt"></i> Monthly Report
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '40px',
                        border: 'none',
                        background: activeTab === 'notes' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                        color: activeTab === 'notes' ? 'white' : '#4b5563',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <i className="fas fa-sticky-note"></i> Notes & Chat
                </button>
            </div>

            {/* Daily Attendance Tab */}
            {activeTab === 'daily' && (
                <>
                    {/* Summary Cards */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#eef2ff' }}>📊</div>
                                <div className="stat-value">{summary.total}</div>
                            </div>
                            <div className="stat-title">Total Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
                                <div className="stat-value" style={{ color: '#10b981' }}>{summary.present}</div>
                            </div>
                            <div className="stat-title">Present</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#fee2e2' }}>❌</div>
                                <div className="stat-value" style={{ color: '#dc2626' }}>{summary.absent}</div>
                            </div>
                            <div className="stat-title">Absent</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
                                <div className="stat-value" style={{ color: '#d97706' }}>{summary.notMarked}</div>
                            </div>
                            <div className="stat-title">Not Marked</div>
                        </div>
                    </div>

                    <div className="attendance-container">
                        <div className="date-picker">
                            <label><i className="fas fa-calendar-alt"></i> Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <button
                                onClick={exportDailyReport}
                                className="btn-primary"
                                style={{ marginLeft: 'auto', padding: '8px 20px' }}
                            >
                                <i className="fas fa-file-excel"></i> Export Daily Report
                            </button>
                        </div>

                        {students.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-user-slash"></i>
                                <p>No students found. Please add students first.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student Name</th>
                                            <th>Course</th>
                                            <th>Enrollment</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => {
                                            const status = getStatus(student.id);
                                            return (
                                                <tr key={student.id}>
                                                    <td>{index + 1}</td>
                                                    <td style={{ fontWeight: '600' }}>{student.name}</td>
                                                    <td>{student.course}</td>
                                                    <td>{student.enrollmentNo || '-'}</td>
                                                    <td>
                                                        {status ? (
                                                            <span className={`status-badge ${status === 'Present' ? 'status-present' : 'status-absent'}`}>
                                                                {status}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Not marked</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => markAttendance(student.id, 'Present')}
                                                            style={{
                                                                background: status === 'Present' ? '#10b981' : '#eef2ff',
                                                                color: status === 'Present' ? 'white' : '#4f46e5',
                                                                marginRight: '8px'
                                                            }}
                                                        >
                                                            <i className="fas fa-check"></i> Present
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => markAttendance(student.id, 'Absent')}
                                                            style={{
                                                                background: status === 'Absent' ? '#dc2626' : '#fef2f2',
                                                                color: status === 'Absent' ? 'white' : '#dc2626'
                                                            }}
                                                        >
                                                            <i className="fas fa-times"></i> Absent
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Monthly Report Tab */}
            {activeTab === 'monthly' && (
                <div className="attendance-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ fontWeight: '600' }}><i className="fas fa-calendar-month"></i> Select Month:</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '40px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <button onClick={exportToExcel} className="btn-primary">
                            <i className="fas fa-file-excel"></i> Export Monthly Report
                        </button>
                    </div>

                    {students.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-user-slash"></i>
                            <p>No students found. Please add students first.</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student Name</th>
                                            <th>Course</th>
                                            <th>Total Days</th>
                                            <th>Present</th>
                                            <th>Absent</th>
                                            <th>Percentage</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyStats.map((stat, idx) => (
                                            <tr key={stat.id}>
                                                <td>{idx + 1}</td>
                                                <td style={{ fontWeight: '600' }}>{stat.name}</td>
                                                <td>{stat.course}</td>
                                                <td>{stat.totalDays}</td>
                                                <td style={{ color: '#10b981', fontWeight: '600' }}>{stat.presentDays}</td>
                                                <td style={{ color: '#dc2626', fontWeight: '600' }}>{stat.absentDays}</td>
                                                <td>
                                                    <span style={{
                                                        background: stat.percentage >= 75 ? '#d1fae5' : stat.percentage >= 60 ? '#fef3c7' : '#fee2e2',
                                                        padding: '4px 8px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: stat.percentage >= 75 ? '#065f46' : stat.percentage >= 60 ? '#92400e' : '#991b1b'
                                                    }}>
                                                        {stat.percentage}%
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        color: stat.percentage >= 75 ? '#10b981' : stat.percentage >= 60 ? '#f59e0b' : '#dc2626'
                                                    }}>
                                                        {stat.percentage >= 75 ? '✅ Good Standing' : stat.percentage >= 60 ? '⚠️ Needs Improvement' : '❌ At Risk'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {monthlyStats.length > 0 && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <strong>Overall Summary</strong><br />
                                        Total Students: {monthlyStats.length}<br />
                                        Average Attendance: {(monthlyStats.reduce((acc, s) => acc + parseFloat(s.percentage), 0) / monthlyStats.length).toFixed(1)}%
                                    </div>
                                    <div>
                                        <strong>At Risk Students</strong><br />
                                        {monthlyStats.filter(s => s.percentage < 60).length} students below 60%
                                    </div>
                                    <div>
                                        <strong>Perfect Attendance</strong><br />
                                        {monthlyStats.filter(s => s.percentage === 100).length} students with 100% attendance
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Notes & Chat Tab */}
            {activeTab === 'notes' && (
                <div className="attendance-container">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                            <i className="fas fa-calendar-month"></i> Filter Notes by Month:
                        </label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '40px',
                                border: '2px solid #e5e7eb',
                                fontSize: '0.9rem',
                                width: '200px'
                            }}
                        />
                    </div>

                    <div style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '16px',
                        marginBottom: '1.5rem'
                    }}>
                        <textarea
                            placeholder="Write a note about attendance, events, holidays, or any remarks..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                marginBottom: '0.5rem'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={addNote} className="btn-primary">
                                <i className="fas fa-paper-plane"></i> {editingNote ? 'Update Note' : 'Add Note'}
                            </button>
                            {editingNote && (
                                <button onClick={() => { setNoteText(''); setEditingNote(null); }} className="btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-history"></i> Attendance Notes & Remarks
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>
                                ({getMonthlyNotes().length} notes)
                            </span>
                        </h3>

                        {getMonthlyNotes().length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <i className="fas fa-sticky-note"></i>
                                <p>No notes for this month. Add your first note above!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {getMonthlyNotes().map(note => (
                                    <div key={note.id} style={{
                                        background: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        transition: 'all 0.2s'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <i className="fas fa-user-circle" style={{ color: '#4f46e5' }}></i>
                                                <span style={{ fontWeight: '600' }}>{note.author}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                                    {new Date(note.date).toLocaleString()}
                                                </span>
                                                {note.editedAt && (
                                                    <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>
                                                        (edited)
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => editNote(note)}
                                                    className="btn-edit"
                                                    style={{ padding: '4px 12px', fontSize: '0.7rem' }}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(note.id)}
                                                    className="btn-delete"
                                                    style={{ padding: '4px 12px', fontSize: '0.7rem' }}
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ color: '#374151', lineHeight: '1.5', marginTop: '0.5rem' }}>
                                            {note.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}   