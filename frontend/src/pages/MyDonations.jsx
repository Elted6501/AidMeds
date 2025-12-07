import { useState, useEffect } from 'react';
import { donationService } from '../services/donationService';

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDonations();
    }, []);

    const loadDonations = async () => {
        try {
            const response = await donationService.getMyDonations();
            if (response.success) {
                setDonations(response.donaciones);
            }
        } catch (error) {
            console.error('Error al cargar donaciones:', error);
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
                <div className="text-xl">Cargando tus donaciones...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Mis Donaciones
                    </h1>
                    <p className="text-gray-600">
                        Historial de tus donaciones de medicamentos
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-blue-600">
                            {donations.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Donaciones</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-yellow-600">
                            {donations.filter(d => d.estado === 'pendiente').length}
                        </div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-green-600">
                            {donations.filter(d => d.estado === 'aprobada').length}
                        </div>
                        <div className="text-sm text-gray-600">Aprobadas</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-blue-600">
                            {donations.filter(d => d.estado === 'entregada').length}
                        </div>
                        <div className="text-sm text-gray-600">Entregadas</div>
                    </div>
                </div>

                {/* Donations List */}
                {donations.length > 0 ? (
                    <div className="space-y-4">
                        {donations.map((donation) => (
                            <div key={donation.id_donacion} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {donation.nombre_medicamento}
                                            </h3>
                                            {getStatusBadge(donation.estado)}
                                        </div>
                                        
                                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                                            <div>
                                                <span className="font-medium">Cantidad:</span> {donation.cantidad} unidades
                                            </div>
                                            <div>
                                                <span className="font-medium">Fecha caducidad:</span>{' '}
                                                {new Date(donation.fecha_caducidad).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="font-medium">Fecha donación:</span>{' '}
                                                {new Date(donation.fecha_donacion).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {donation.imagen_url && (
                                            <div className="mt-4">
                                                <img 
                                                    src={donation.imagen_url} 
                                                    alt={donation.nombre_medicamento}
                                                    className="h-32 w-32 object-cover rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-6xl mb-4">💊</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes donaciones aún
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Comienza a ayudar donando medicamentos que ya no necesites
                        </p>
                        <a
                            href="/donate"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
                        >
                            Hacer una Donación
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDonations;
