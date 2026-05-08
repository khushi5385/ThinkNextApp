import React, { useState, useEffect } from 'react';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = () => {
        try {
            const stored = localStorage.getItem('courses');
            if (stored) {
                const parsedCourses = JSON.parse(stored);
                if (parsedCourses && parsedCourses.length > 0) {
                    setCourses(parsedCourses);
                } else {
                    const defaultCourses = getDefaultCourses();
                    setCourses(defaultCourses);
                    localStorage.setItem('courses', JSON.stringify(defaultCourses));
                }
            } else {
                const defaultCourses = getDefaultCourses();
                setCourses(defaultCourses);
                localStorage.setItem('courses', JSON.stringify(defaultCourses));
            }
        } catch (error) {
            console.error("Error loading courses:", error);
            // Set default courses on error
            const defaultCourses = getDefaultCourses();
            setCourses(defaultCourses);
        } finally {
            setLoading(false);
        }
    };

    const getDefaultCourses = () => {
        return [
            { id: 1, name: 'B.Tech Computer Science', code: 'CSE101', category: 'engineering', instructor: 'Dr. Rajesh Kumar', duration: '4 Years', fees: '₹1,50,000/year', description: 'Complete CSE program with programming, DSA, AI/ML', seats: 120, level: 'B.Tech', icon: '💻', color: '#4f46e5', topics: ['Programming', 'DSA', 'DBMS', 'AI/ML'] },
            { id: 2, name: 'Data Science & AI', code: 'DS201', category: 'technical', instructor: 'Prof. Priya Sharma', duration: '6 Months', fees: '₹55,000', description: 'Complete Data Science with Python and ML', seats: 80, level: 'Diploma', icon: '📊', color: '#10b981', topics: ['Python', 'NumPy', 'Pandas', 'Machine Learning'] },
            { id: 3, name: 'MERN Stack Development', code: 'WEB301', category: 'technical', instructor: 'Ankit Singh', duration: '4 Months', fees: '₹45,000', description: 'MongoDB, Express, React, Node.js', seats: 70, level: 'Certificate', icon: '⚛️', color: '#f59e0b', topics: ['React', 'Node.js', 'MongoDB', 'Express'] },
            { id: 4, name: 'Civil Engineering', code: 'CIV401', category: 'engineering', instructor: 'Dr. Suresh Patel', duration: '4 Years', fees: '₹1,20,000/year', description: 'Structural, Construction Engineering', seats: 120, level: 'B.Tech', icon: '🏗️', color: '#ef4444', topics: ['Structure', 'Construction', 'Surveying'] },
            { id: 5, name: 'Mechanical Engineering', code: 'MEC501', category: 'engineering', instructor: 'Prof. Vikram Singh', duration: '4 Years', fees: '₹1,20,000/year', description: 'Thermodynamics, Robotics', seats: 120, level: 'B.Tech', icon: '⚙️', color: '#8b5cf6', topics: ['Thermodynamics', 'Robotics', 'CAD/CAM'] },
            { id: 6, name: 'Python Programming', code: 'PY601', category: 'technical', instructor: 'Dr. Anjali Verma', duration: '3 Months', fees: '₹25,000', description: 'Complete Python from Basics to Advanced', seats: 150, level: 'Certificate', icon: '🐍', color: '#22c55e', topics: ['Python Basics', 'OOPs', 'Django'] },
            { id: 7, name: 'Cloud Computing', code: 'CLD701', category: 'technical', instructor: 'Amit Kumar', duration: '5 Months', fees: '₹65,000', description: 'AWS, Docker, Kubernetes', seats: 55, level: 'Advanced', icon: '☁️', color: '#6366f1', topics: ['AWS', 'Docker', 'Kubernetes'] },
            { id: 8, name: 'Cybersecurity', code: 'SEC801', category: 'technical', instructor: 'Capt. Sanjay Rawat', duration: '6 Months', fees: '₹65,000', description: 'Network Security, Ethical Hacking', seats: 50, level: 'Advanced', icon: '🔒', color: '#dc2626', topics: ['Network Security', 'Kali Linux', 'Penetration Testing'] },
            { id: 9, name: 'Mobile App Development', code: 'MOB901', category: 'technical', instructor: 'Kavita Joshi', duration: '4 Months', fees: '₹48,000', description: 'Flutter, React Native', seats: 70, level: 'Diploma', icon: '📱', color: '#f97316', topics: ['Flutter', 'React Native', 'Firebase'] },
            { id: 10, name: 'Electrical Engineering', code: 'EEE1001', category: 'engineering', instructor: 'Dr. Neha Gupta', duration: '4 Years', fees: '₹1,20,000/year', description: 'Power Systems, Renewable Energy', seats: 90, level: 'B.Tech', icon: '⚡', color: '#ec4899', topics: ['Power Systems', 'Control Systems', 'Renewable Energy'] }
        ];
    };

    // Safely compute categories - only when courses is an array
    const categories = [
        { id: 'all', name: 'All Courses', icon: '📚', count: courses?.length || 0 },
        { id: 'engineering', name: 'Engineering', icon: '🔧', count: courses?.filter(c => c?.category === 'engineering')?.length || 0 },
        { id: 'technical', name: 'Technical / IT', icon: '💻', count: courses?.filter(c => c?.category === 'technical')?.length || 0 }
    ];

    // Safely filter courses
    const filteredCourses = (courses || []).filter(course => {
        if (!course) return false;
        const matchCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchSearch = searchTerm === '' ||
            (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.topics && Array.isArray(course.topics) && course.topics.some(t => t && t.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchCategory && matchSearch;
    });

    if (loading) {
        return (
            <div className="empty-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading courses...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <i className="fas fa-book-open"></i>
                    Course Catalog
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#4f46e5', background: '#eef2ff', padding: '6px 16px', borderRadius: '40px' }}>
                    <i className="fas fa-graduation-cap"></i> {courses?.length || 0}+ Professional Courses
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: '18px', top: '14px', color: '#9ca3af' }}></i>
                    <input
                        type="text"
                        placeholder="Search courses by name, instructor, or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 20px 12px 48px',
                            borderRadius: '40px',
                            border: '2px solid #e5e7eb',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            padding: '10px 28px',
                            borderRadius: '40px',
                            border: selectedCategory === cat.id ? 'none' : '2px solid #e5e7eb',
                            background: selectedCategory === cat.id ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'white',
                            color: selectedCategory === cat.id ? 'white' : '#4f46e5',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <span>{cat.icon}</span> {cat.name}
                        <span style={{
                            background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : '#eef2ff',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            fontSize: '0.7rem'
                        }}>{cat.count}</span>
                    </button>
                ))}
            </div>

            {/* Results Info */}
            {filteredCourses.length > 0 && (
                <div style={{ marginBottom: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                    <i className="fas fa-list"></i> Showing {filteredCourses.length} of {courses?.length || 0} courses
                </div>
            )}

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-search"></i>
                    <p>No courses found matching your search</p>
                    <button onClick={() => setSearchTerm('')} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-header" style={{ background: `linear-gradient(135deg, ${course.color || '#4f46e5'}, ${course.color || '#7c3aed'}dd)` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                        <span style={{ fontSize: '1.4rem' }}>{course.icon || '📚'}</span>
                                        {course.name && course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name}
                                    </h3>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        fontSize: '0.6rem',
                                        fontWeight: '600'
                                    }}>
                                        {course.code}
                                    </span>
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
                                    <span><strong>Level:</strong> {course.level}</span>
                                </div>
                                <div className="course-info">
                                    <i className="fas fa-credit-card"></i>
                                    <span><strong>Fees:</strong> {course.fees}</span>
                                </div>
                                <div className="course-info">
                                    <i className="fas fa-users"></i>
                                    <span><strong>Seats:</strong> {course.seats}</span>
                                </div>
                                <div className="course-info" style={{ alignItems: 'flex-start' }}>
                                    <i className="fas fa-info-circle"></i>
                                    <span><strong>Description:</strong> {course.description && course.description.length > 80 ? course.description.substring(0, 80) + '...' : course.description}</span>
                                </div>

                                {course.topics && Array.isArray(course.topics) && course.topics.length > 0 && (
                                    <div style={{ marginTop: '12px' }}>
                                        <div className="course-info" style={{ alignItems: 'flex-start' }}>
                                            <i className="fas fa-tags"></i>
                                            <span><strong>Topics:</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginLeft: '28px', marginTop: '5px' }}>
                                            {course.topics.slice(0, 4).map((topic, idx) => (
                                                <span key={idx} style={{
                                                    background: '#f3e8ff',
                                                    padding: '3px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    color: '#7c3aed',
                                                    fontWeight: '500'
                                                }}>
                                                    {topic}
                                                </span>
                                            ))}
                                            {course.topics.length > 4 && (
                                                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>+{course.topics.length - 4} more</span>
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
    );
}
