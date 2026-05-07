import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = login(email, password, role);

        if (result.success) {
            navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } else {
            setError(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '32px',
                padding: '2.5rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                animation: 'slideUp 0.5s ease'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎓</div>
                    <h1 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '0.5rem' }}>
                        ThinkNEXT Technologies
                    </h1>
                    <p style={{ color: '#6b7280' }}>Student Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        background: '#f3f4f6',
                        padding: '0.5rem',
                        borderRadius: '60px'
                    }}>
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '40px',
                                border: 'none',
                                background: role === 'student' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                                color: role === 'student' ? 'white' : '#4b5563',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className="fas fa-user-graduate"></i> Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '40px',
                                border: 'none',
                                background: role === 'admin' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                                color: role === 'admin' ? 'white' : '#4b5563',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className="fas fa-user-shield"></i> Admin
                        </button>
                    </div>

                    {/* Email Input */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                            <i className="fas fa-envelope"></i> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === 'admin' ? 'admin@thinknext.com' : 'student@example.com'}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                            <i className="fas fa-lock"></i> Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={role === 'admin' ? 'admin123' : 'password123'}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '16px',
                                    fontSize: '1rem',
                                    paddingRight: '45px'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '12px',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '1rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>

                    {role === 'student' && (
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            padding: '1rem',
                            background: '#f3f4f6',
                            borderRadius: '12px'
                        }}>
                            <p><strong>Demo Student Credentials:</strong></p>
                            <p>Email: john@example.com | Password: password123</p>
                            <p style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
                                Note: Register as student first from admin panel
                            </p>
                        </div>
                    )}

                    {role === 'admin' && (
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            padding: '1rem',
                            background: '#f3f4f6',
                            borderRadius: '12px'
                        }}>
                            <p><strong>Admin Credentials:</strong></p>
                            <p>Email: admin@thinknext.com | Password: admin123</p>
                        </div>
                    )}
                </form>
            </div>

            <style>
                {`
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </div>
    );
}