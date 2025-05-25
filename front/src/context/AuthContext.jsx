import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(() => {
        // Initialize from localStorage if available
        return localStorage.getItem('userRole') || null;
    });

    const login = (role) => {
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    const logout = () => {
        setUserRole(null);
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 