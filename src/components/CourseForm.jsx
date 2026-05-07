import React, { useState } from 'react';

export default function CourseForm({ onSave, onClose, initialData }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        code: initialData?.code || '',
        category: initialData?.category || 'technical',
        instructor: initialData?.instructor || '',
        duration: initialData?.duration || '',
        fees: initialData?.fees || '',
        description: initialData?.description || '',
        seats: initialData?.seats || '',
        level: initialData?.level || 'Certificate',
        credits: initialData?.credits || '',
        icon: initialData?.icon || '📖'
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Course name required';
        if (!formData.instructor.trim()) newErrors.instructor = 'Instructor name required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave(formData);
    };

    const icons = ['💻', '📊', '⚛️', '🐍', '🌐', '☁️', '🔒', '📱', '🏗️', '⚙️', '⚡', '📡', '🎓', '📚', '🔧'];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <h3>
                    <i className="fas fa-book"></i>
                    {initialData ? '✏️ Edit Course' : '➕ Add New Course'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Course Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ borderColor: errors.name ? '#dc2626' : '#e9d5ff' }}
                        />
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            style={{ width: '70px', textAlign: 'center' }}
                        >
                            {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                    </div>
                    {errors.name && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px' }}>{errors.name}</small>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Course Code (e.g., CSE101)"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="engineering">🏗️ Engineering</option>
                            <option value="technical">💻 Technical</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Instructor Name *"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        style={{ borderColor: errors.instructor ? '#dc2626' : '#e9d5ff' }}
                    />
                    {errors.instructor && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px' }}>{errors.instructor}</small>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Duration * (e.g., 4 Years)"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            style={{ borderColor: errors.duration ? '#dc2626' : '#e9d5ff' }}
                        />
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        >
                            <option value="Certificate">Certificate</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    {errors.duration && <small style={{ color: '#dc2626', display: 'block', marginBottom: '8px' }}>{errors.duration}</small>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Fees (e.g., ₹50,000)"
                            value={formData.fees}
                            onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Seats Available"
                            value={formData.seats}
                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="number"
                            placeholder="Credits"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-info-circle"></i> Total Credits
                        </div>
                    </div>

                    <textarea
                        placeholder="Course Description (Topics covered, skills learned...)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        style={{ resize: 'vertical' }}
                    />

                    <div className="modal-buttons">
                        <button type="submit" className="btn-primary">
                            <i className="fas fa-save"></i> {initialData ? 'Update Course' : 'Save Course'}
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