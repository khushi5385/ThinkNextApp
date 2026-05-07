import React, { useState, useEffect } from 'react';

export default function StudentForm({ onSave, onClose, initialData, courses }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: initialData?.password || 'password123',
        course: initialData?.course || '',
        phone: initialData?.phone || '',
        enrollmentNo: initialData?.enrollmentNo || ''
    });
    const handleSave = (studentData) => {
        // ... existing validation code ...

        if (editingStudent) {
            newStudents = students.map(s =>
                s.id === editingStudent.id ? {
                    ...studentData,
                    id: s.id,
                    courseIcon: selectedCourseObj?.icon || '📚',
                    courseColor: selectedCourseObj?.color || '#4f46e5'
                } : s
            );
        } else {
            newStudents = [...students, {
                ...studentData,
                id: Date.now(),
                courseIcon: selectedCourseObj?.icon || '📚',
                courseColor: selectedCourseObj?.color || '#4f46e5'
            }];
        }
        // ... rest of the code
    };
    
    const [errors, setErrors] = useState({});
    const [availableCourses, setAvailableCourses] = useState([]);

    useEffect(() => {
        if (courses && Array.isArray(courses) && courses.length > 0) {
            setAvailableCourses(courses);
        } else {
            const defaultCourses = [
                { id: 1, name: 'B.Tech Computer Science', code: 'CSE101', icon: '💻', duration: '4 Years', fees: '₹1,50,000/year', instructor: 'Dr. Rajesh Kumar' },
                { id: 2, name: 'Data Science & AI', code: 'DS201', icon: '📊', duration: '6 Months', fees: '₹55,000', instructor: 'Prof. Priya Sharma' },
                { id: 3, name: 'MERN Stack Development', code: 'WEB301', icon: '⚛️', duration: '4 Months', fees: '₹45,000', instructor: 'Ankit Singh' },
            ];
            setAvailableCourses(defaultCourses);
        }
    }, [courses]);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.course) newErrors.course = 'Please select a course';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    const selectedCourseDetails = availableCourses.find(c => c.name === formData.course);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>
                    <i className="fas fa-user-graduate"></i>
                    {initialData ? '✏️ Edit Student' : '➕ Add New Student'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ borderColor: errors.name ? '#dc2626' : '#e5e7eb' }}
                    />
                    {errors.name && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px', fontSize: '0.75rem' }}>{errors.name}</small>}

                    <input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ borderColor: errors.email ? '#dc2626' : '#e5e7eb' }}
                    />
                    {errors.email && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px', fontSize: '0.75rem' }}>{errors.email}</small>}

                    <input
                        type="text"
                        placeholder="Enrollment Number"
                        value={formData.enrollmentNo}
                        onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password *"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ borderColor: errors.password ? '#dc2626' : '#e5e7eb' }}
                    />
                    {errors.password && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px', fontSize: '0.75rem' }}>{errors.password}</small>}

                    <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        style={{ borderColor: errors.course ? '#dc2626' : '#e5e7eb' }}
                    >
                        <option value="">🎓 Select a Course *</option>
                        {availableCourses.map(course => (
                            <option key={course.id} value={course.name}>
                                {course.icon} {course.name} - {course.duration}
                            </option>
                        ))}
                    </select>
                    {errors.course && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px', fontSize: '0.75rem' }}>{errors.course}</small>}

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    {selectedCourseDetails && (
                        <div style={{
                            background: '#f8fafc',
                            padding: '12px',
                            borderRadius: '16px',
                            marginBottom: '1rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                <div>👨‍🏫 {selectedCourseDetails.instructor}</div>
                                <div>💰 {selectedCourseDetails.fees}</div>
                            </div>
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button type="submit" className="btn-primary">
                            <i className="fas fa-save"></i> {initialData ? 'Update Student' : 'Register Student'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}