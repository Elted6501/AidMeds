import { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const response = await requestService.getMyRequests();
            if (response.success) {
                setRequests(response.solicitudes);
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (estado) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            aprobada: 'bg-green-100 text-green-800',
            rechazada: 'bg-red-100 text-red-800',
            entregada: 'bg-blue-100 text-blue-800'
        };

        const labels = {
            pendiente: '⏳ Pendiente',
            aprobada: '✅ Aprobada',
            rechazada: '❌ Rechazada',
            entregada: '📦 Entregada'
        };

        return (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[estado]}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Cargando tus solicitudes...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Mis Solicitudes
                    </h1>
                    <p className="text-gray-600">
                        Historial de tus solicitudes de medicamentos
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-blue-600">
                            {requests.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Solicitudes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-yellow-600">
                            {requests.filter(r => r.estado === 'pendiente').length}
                        </div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-green-600">
                            {requests.filter(r => r.estado === 'aprobada').length}
                        </div>
                        <div className="text-sm text-gray-600">Aprobadas</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-blue-600">
                            {requests.filter(r => r.estado === 'entregada').length}
                        </div>
                        <div className="text-sm text-gray-600">Entregadas</div>
                    </div>
                </div>

                {/* Requests List */}
                {requests.length > 0 ? (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div key={request.id_solicitud} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {request.nombre_medicamento}
                                            </h3>
                                            {getStatusBadge(request.estado)}
                                            {request.tipo_medicamento === 'con_receta' && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                    ⚕️ Con Receta
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                                            <div>
                                                <span className="font-medium">Cantidad:</span> {request.cantidad} unidades
                                            </div>
                                            <div>
                                                <span className="font-medium">Fecha solicitud:</span>{' '}
                                                {new Date(request.fecha_solicitud).toLocaleDateString()}
                                            </div>
                                            {request.receta_url && (
                                                <div>
                                                    <a 
                                                        href={request.receta_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        📄 Ver receta
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Messages */}
                                        {request.estado === 'aprobada' && (
                                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                                                <p className="text-sm text-green-800">
                                                    ✅ Tu solicitud ha sido aprobada. Espera instrucciones sobre cómo recoger tu medicamento.
                                                </p>
                                            </div>
                                        )}
                                        {request.estado === 'rechazada' && (
                                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                                <p className="text-sm text-red-800">
                                                    ❌ Tu solicitud fue rechazada. Por favor contacta al administrador para más información.
                                                </p>
                                            </div>
                                        )}
                                        {request.estado === 'entregada' && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                                <p className="text-sm text-blue-800">
                                                    📦 Medicamento entregado exitosamente. ¡Gracias por usar AidMeds!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-6xl mb-4">🏥</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes solicitudes aún
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ¿Necesitas medicamentos? Realiza una solicitud y te ayudaremos
                        </p>
                        <a
                            href="/request"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
                        >
                            Solicitar Medicamento
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequests;
