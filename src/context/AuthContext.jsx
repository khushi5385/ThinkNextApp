import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password, role) => {
        // Admin credentials
        if (role === 'admin' && email === 'admin@thinknext.com' && password === 'admin123') {
            const adminUser = {
                id: 'admin',
                name: 'Admin User',
                email: email,
                role: 'admin',
                avatar: '👨‍💼'
            };
            setUser(adminUser);
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }

        // Student login - check localStorage
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.email === email && s.password === password);

        if (student && role === 'student') {
            const studentUser = {
                id: student.id,
                name: student.name,
                email: student.email,
                role: 'student',
                course: student.course,
                enrollmentNo: student.enrollmentNo,
                avatar: '👨‍🎓'
            };
            setUser(studentUser);
            localStorage.setItem('currentUser', JSON.stringify(studentUser));
            return { success: true, user: studentUser };
        }

        return { success: false, message: 'Invalid credentials!' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}