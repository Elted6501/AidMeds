import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Bienvenido a AidMeds
                    </h1>
                    <p className="text-xl mb-8">
                        Plataforma para donación y solicitud de medicamentos
                    </p>
                    {!isAuthenticated && (
                        <div className="space-x-4">
                            <Link 
                                to="/register" 
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
                            >
                                Registrarse
                            </Link>
                            <Link 
                                to="/login" 
                                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 inline-block"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Donar */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="text-blue-600 text-4xl mb-4">💊</div>
                        <h3 className="text-2xl font-bold mb-4">Dona Medicamentos</h3>
                        <p className="text-gray-600 mb-4">
                            ¿Tienes medicamentos que ya no necesitas? Dónalos y ayuda a quien más lo necesita.
                        </p>
                        {isAuthenticated && (
                            <Link 
                                to="/donate" 
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Hacer una donación →
                            </Link>
                        )}
                    </div>

                    {/* Solicitar */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="text-blue-600 text-4xl mb-4">🏥</div>
                        <h3 className="text-2xl font-bold mb-4">Solicita Medicamentos</h3>
                        <p className="text-gray-600 mb-4">
                            ¿Necesitas medicamentos? Solicita los que requieres de manera sencilla y rápida.
                        </p>
                        {isAuthenticated && (
                            <Link 
                                to="/request" 
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Hacer una solicitud →
                            </Link>
                        )}
                    </div>

                    {/* Catálogo */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="text-blue-600 text-4xl mb-4">📋</div>
                        <h3 className="text-2xl font-bold mb-4">Catálogo de Medicamentos</h3>
                        <p className="text-gray-600 mb-4">
                            Consulta el catálogo completo de medicamentos disponibles en el sistema.
                        </p>
                        <Link 
                            to="/medicines" 
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Ver catálogo →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section (if authenticated) */}
            {isAuthenticated && (
                <div className="bg-blue-50 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Tu Actividad
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                                <div className="text-gray-600">Donaciones Realizadas</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                                <div className="text-gray-600">Solicitudes Realizadas</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                                <div className="text-gray-600">Personas Ayudadas</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Call to Action */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    ¿Listo para comenzar?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Únete a nuestra comunidad y ayuda a hacer la diferencia. 
                    Cada donación cuenta, cada solicitud es importante.
                </p>
                {!isAuthenticated && (
                    <Link 
                        to="/register" 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
                    >
                        Comienza Ahora
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Home;
