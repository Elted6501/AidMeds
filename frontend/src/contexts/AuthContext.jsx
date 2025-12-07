import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await authService.getProfile();
                if (response.success) {
                    setUser(response.user);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log('Not authenticated');
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            
            if (response.success && response.token) {
                setUser(response.user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success && response.token) {
                setUser(response.user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al registrarse'
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
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
