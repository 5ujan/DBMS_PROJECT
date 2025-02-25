import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user } = useStore();
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            history.push('/signin');
        } else {
            setAuthUser(user);
            if (user.role === 'admin') {
                history.push('/admin/dashboard');
            } else if (user.role === 'volunteer' || user.role === 'organization') {
                history.push('/dashboard');
            }
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ authUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};