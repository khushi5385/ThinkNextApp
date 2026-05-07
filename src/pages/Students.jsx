import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
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
        if (storedStudents) setStudents(JSON.parse(storedStudents));

        let courseData = localStorage.getItem('courses');
        if (!courseData || JSON.parse(courseData).length === 0) {
            const defaultCourses = getDefaultCourses();
            localStorage.setItem('courses', JSON.stringify(defaultCourses));
            setCourses(defaultCourses);
        } else {
            setCourses(JSON.parse(courseData));
        }
    };

    const getDefaultCourses = () => {
        return [
            { id: 1, name: 'B.Tech Computer Science', code: 'CSE101', icon: '💻', color: '#4f46e5', duration: '4 Years', fees: '₹1,50,000/year', instructor: 'Dr. Rajesh Kumar' },
            { id: 2, name: 'Data Science & AI', code: 'DS201', icon: '📊', color: '#10b981', duration: '6 Months', fees: '₹55,000', instructor: 'Prof. Priya Sharma' },
            { id: 3, name: 'MERN Stack Development', code: 'WEB301', icon: '⚛️', color: '#f59e0b', duration: '4 Months', fees: '₹45,000', instructor: 'Ankit Singh' },
            { id: 4, name: 'Full Stack Development', code: 'FSD401', icon: '🌐', color: '#3b82f6', duration: '6 Months', fees: '₹60,000', instructor: 'Rahul Mehta' },
            { id: 5, name: 'Python Programming', code: 'PY501', icon: '🐍', color: '#22c55e', duration: '3 Months', fees: '₹25,000', instructor: 'Dr. Anjali Verma' },
        ];
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

        const selectedCourseObj = courses.find(c => c.name === studentData.course);

        let newStudents;
        if (editingStudent) {
            newStudents = students.map(s =>
                s.id === editingStudent.id ? {
                    ...studentData,
                    id: s.id,
                    courseIcon: selectedCourseObj?.icon || '📚',
                    courseColor: selectedCourseObj?.color || '#4f46e5'
                } : s
            );
            showAlert('✅ Student updated successfully!', 'success');
        } else {
            newStudents = [...students, {
                ...studentData,
                id: Date.now(),
                courseIcon: selectedCourseObj?.icon || '📚',
                courseColor: selectedCourseObj?.color || '#4f46e5'
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

            {/* Search and Filter */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1 }}>
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
                        const courseInfo = courses.find(crs => crs.name === course);
                        const isAll = course === 'all';
                        const count = isAll ? students.length : students.filter(s => s.course === course).length;
                        return (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                style={{
                                    padding: '6px 18px',
                                    borderRadius: '40px',
                                    border: selectedCourse === course ? 'none' : '2px solid #e5e7eb',
                                    background: selectedCourse === course ? `linear-gradient(135deg, ${courseInfo?.color || '#4f46e5'}, ${courseInfo?.color || '#7c3aed'})` : 'white',
                                    color: selectedCourse === course ? 'white' : courseInfo?.color || '#4f46e5',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {!isAll && (courseInfo?.icon || '📚')} {course === 'all' ? 'All Students' : course} ({count})
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
                        const courseInfo = courses.find(c => c.name === student.course);
                        return (
                            <div key={student.id} className="course-card">
                                <div className="course-header" style={{
                                    background: `linear-gradient(135deg, ${student.courseColor || courseInfo?.color || '#4f46e5'}, ${student.courseColor || courseInfo?.color || '#7c3aed'})`
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
                                        background: `linear-gradient(135deg, ${student.courseColor || courseInfo?.color || '#4f46e5'}15, transparent)`,
                                        padding: '10px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <span style={{ fontSize: '1.8rem' }}>{student.courseIcon || courseInfo?.icon || '📚'}</span>
                                        <div>
                                            <div style={{ fontWeight: '700', color: student.courseColor || courseInfo?.color || '#4f46e5' }}>
                                                {student.course}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                                {courseInfo?.instructor && `👨‍🏫 ${courseInfo.instructor}`}
                                            </div>
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
                    courses={courses}
                />
            )}
        </div>
    );
}