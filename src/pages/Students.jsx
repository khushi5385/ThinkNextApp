import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [alert, setAlert] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
            setStudents(JSON.parse(storedStudents));
        } else {
            // Add sample data for testing
            const sampleStudents = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    course: 'B.Tech Computer Science',
                    phone: '9876543210',
                    enrollmentNo: '2024001',
                    password: 'password123'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    course: 'Data Science',
                    phone: '9876543211',
                    enrollmentNo: '2024002',
                    password: 'password123'
                }
            ];
            setStudents(sampleStudents);
            localStorage.setItem('students', JSON.stringify(sampleStudents));
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleSave = (studentData) => {
        const isDuplicate = students.some(s =>
            s.email.toLowerCase() === studentData.email.toLowerCase() &&
            (!editingStudent || s.id !== editingStudent.id)
        );

        if (isDuplicate) {
            showAlert('❌ Student with this email already exists!', 'error');
            return false;
        }

        let newStudents;
        if (editingStudent) {
            newStudents = students.map(s =>
                s.id === editingStudent.id ? {
                    ...studentData,
                    id: s.id
                } : s
            );
            showAlert('✅ Student updated successfully!', 'success');
        } else {
            newStudents = [...students, {
                ...studentData,
                id: Date.now()
            }];
            showAlert('🎉 Student added successfully!', 'success');
        }

        setStudents(newStudents);
        localStorage.setItem('students', JSON.stringify(newStudents));
        setShowModal(false);
        setEditingStudent(null);
        return true;
    };

    const handleDelete = (id) => {
        if (window.confirm('⚠️ Delete this student? This action cannot be undone!')) {
            const newStudents = students.filter(s => s.id !== id);
            setStudents(newStudents);
            localStorage.setItem('students', JSON.stringify(newStudents));
            showAlert('🗑️ Student deleted!', 'success');
        }
    };

    const filteredStudents = students.filter(s => {
        const matchCourse = selectedCourse === 'all' || s.course === selectedCourse;
        const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchCourse && matchSearch;
    });

    const getUniqueCourses = () => {
        const courseList = students.map(s => s.course);
        return ['all', ...new Set(courseList)];
    };

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
                    <i className="fas fa-user-graduate"></i>
                    Student Management
                </h1>
                <button className="btn-primary" onClick={() => { setShowModal(true); setEditingStudent(null); }}>
                    <i className="fas fa-plus-circle"></i> Add Student
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '12px', color: '#9ca3af' }}></i>
                    <input
                        type="text"
                        placeholder="Search by name, email, or enrollment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 20px 12px 44px',
                            borderRadius: '40px',
                            border: '2px solid #e5e7eb',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Course Filter */}
            {students.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '0.8rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: '600', color: '#4f46e5' }}>Filter by Course:</span>
                    {getUniqueCourses().map(course => {
                        const count = course === 'all' ? students.length : students.filter(s => s.course === course).length;
                        return (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                style={{
                                    padding: '6px 18px',
                                    borderRadius: '40px',
                                    border: selectedCourse === course ? 'none' : '2px solid #e5e7eb',
                                    background: selectedCourse === course ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'white',
                                    color: selectedCourse === course ? 'white' : '#4f46e5',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {course === 'all' ? 'All Students' : course} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Student Cards Grid */}
            {filteredStudents.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-user-friends"></i>
                    <p>{students.length === 0 ? 'No students enrolled yet' : 'No students match your search'}</p>
                    {students.length === 0 && (
                        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>
                            Add Your First Student
                        </button>
                    )}
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredStudents.map(student => {
                        return (
                            <div key={student.id} className="course-card">
                                <div className="course-header" style={{
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1.6rem' }}>👨‍🎓</span>
                                            {student.name.length > 20 ? student.name.substring(0, 20) + '...' : student.name}
                                        </h3>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.65rem',
                                            fontWeight: '600'
                                        }}>
                                            #{student.enrollmentNo?.slice(-6) || student.id.toString().slice(-6)}
                                        </span>
                                    </div>
                                </div>
                                <div className="course-body">
                                    <div className="course-info">
                                        <i className="fas fa-envelope"></i>
                                        <span>{student.email}</span>
                                    </div>
                                    <div className="course-info">
                                        <i className="fas fa-phone"></i>
                                        <span>{student.phone || 'Not provided'}</span>
                                    </div>
                                    <div style={{
                                        marginTop: '12px',
                                        marginBottom: '12px',
                                        background: '#f3f4f6',
                                        padding: '10px',
                                        borderRadius: '16px'
                                    }}>
                                        <div style={{ fontWeight: '700', color: '#4f46e5' }}>
                                            📚 {student.course || 'No course specified'}
                                        </div>
                                    </div>
                                    <div className="course-actions">
                                        <button className="btn-edit" onClick={() => { setEditingStudent(student); setShowModal(true); }}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(student.id)}>
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <StudentForm
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingStudent(null); }}
                    initialData={editingStudent}
                />
            )}
        </div>
    );
}
