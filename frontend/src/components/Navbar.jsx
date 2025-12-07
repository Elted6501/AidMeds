import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsProfileOpen(false);
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold">
                        AidMeds
                    </Link>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Inicio
                                </Link>
                                <Link to="/medicines" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Medicamentos
                                </Link>
                                <Link to="/donate" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Donar
                                </Link>
                                <Link to="/request" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Solicitar
                                </Link>
                                
                                {user?.rol === 'admin' && (
                                    <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                                        Admin
                                    </Link>
                                )}

                                <div className="relative" ref={profileRef}>
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="hover:bg-blue-700 px-3 py-2 rounded"
                                    >
                                        {user?.nombre || 'Usuario'}
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link 
                                                to="/profile" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Mi Perfil
                                            </Link>
                                            <Link 
                                                to="/my-donations" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Mis Donaciones
                                            </Link>
                                            <Link 
                                                to="/my-requests" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Mis Solicitudes
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Iniciar Sesión
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
