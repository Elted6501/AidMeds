import { useState, useEffect } from 'react';
import { donationService } from '../services/donationService';
import { requestService } from '../services/requestService';
import { medicineService } from '../services/medicineService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalDonations: 0,
        pendingDonations: 0,
        totalRequests: 0,
        pendingRequests: 0,
        totalMedicines: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('donations'); // donations, requests, medicines

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [donations, requests, medicines] = await Promise.all([
                donationService.getAll(),
                requestService.getAll(),
                medicineService.getAll()
            ]);

            setStats({
                totalDonations: donations.donaciones?.length || 0,
                pendingDonations: donations.donaciones?.filter(d => d.estado === 'pendiente').length || 0,
                totalRequests: requests.solicitudes?.length || 0,
                pendingRequests: requests.solicitudes?.filter(r => r.estado === 'pendiente').length || 0,
                totalMedicines: medicines.medicamentos?.length || 0
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Cargando panel de administración...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-600">
                        Gestiona donaciones, solicitudes y medicamentos
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {stats.totalDonations}
                        </div>
                        <div className="text-sm text-gray-600">Total Donaciones</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                            {stats.pendingDonations}
                        </div>
                        <div className="text-sm text-gray-600">Donaciones Pendientes</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {stats.totalRequests}
                        </div>
                        <div className="text-sm text-gray-600">Total Solicitudes</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {stats.pendingRequests}
                        </div>
                        <div className="text-sm text-gray-600">Solicitudes Pendientes</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            {stats.totalMedicines}
                        </div>
                        <div className="text-sm text-gray-600">Medicamentos</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('donations')}
                                className={`px-6 py-4 font-semibold ${
                                    activeTab === 'donations'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Donaciones ({stats.pendingDonations} pendientes)
                            </button>
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`px-6 py-4 font-semibold ${
                                    activeTab === 'requests'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Solicitudes ({stats.pendingRequests} pendientes)
                            </button>
                            <button
                                onClick={() => setActiveTab('medicines')}
                                className={`px-6 py-4 font-semibold ${
                                    activeTab === 'medicines'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Medicamentos
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'donations' && <DonationsManager onUpdate={loadStats} />}
                        {activeTab === 'requests' && <RequestsManager onUpdate={loadStats} />}
                        {activeTab === 'medicines' && <MedicinesManager onUpdate={loadStats} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Donations Manager Component
const DonationsManager = ({ onUpdate }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pendiente');

    useEffect(() => {
        loadDonations();
    }, [filter]);

    const loadDonations = async () => {
        try {
            const response = await donationService.getAll();
            if (response.success) {
                const filtered = filter === 'todas' 
                    ? response.donaciones 
                    : response.donaciones.filter(d => d.estado === filter);
                setDonations(filtered);
            }
        } catch (error) {
            console.error('Error al cargar donaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await donationService.updateStatus(id, newStatus);
            loadDonations();
            onUpdate();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        }
    };

    const getStatusBadge = (estado) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            aprobada: 'bg-green-100 text-green-800',
            rechazada: 'bg-red-100 text-red-800',
            entregada: 'bg-blue-100 text-blue-800'
        };
        return styles[estado] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-8">Cargando donaciones...</div>;
    }

    return (
        <div>
            {/* Filter */}
            <div className="mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="rechazada">Rechazadas</option>
                    <option value="entregada">Entregadas</option>
                    <option value="todas">Todas</option>
                </select>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
                {donations.length > 0 ? (
                    donations.map((donation) => (
                        <div key={donation.id_donacion} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{donation.nombre_medicamento}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(donation.estado)}`}>
                                            {donation.estado}
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                                        <div><span className="font-medium">Donante:</span> {donation.nombre_usuario}</div>
                                        <div><span className="font-medium">Cantidad:</span> {donation.cantidad}</div>
                                        <div><span className="font-medium">Caducidad:</span> {new Date(donation.fecha_caducidad).toLocaleDateString()}</div>
                                        <div><span className="font-medium">Fecha:</span> {new Date(donation.fecha_donacion).toLocaleDateString()}</div>
                                    </div>
                                    {donation.imagen_url && (
                                        <img src={donation.imagen_url} alt="Medicamento" className="mt-3 h-24 w-24 object-cover rounded" />
                                    )}
                                </div>
                                {donation.estado === 'pendiente' && (
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleStatusChange(donation.id_donacion, 'aprobada')}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(donation.id_donacion, 'rechazada')}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                                {donation.estado === 'aprobada' && (
                                    <button
                                        onClick={() => handleStatusChange(donation.id_donacion, 'entregada')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
                                    >
                                        Marcar Entregada
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        No hay donaciones {filter !== 'todas' ? filter + 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

// Requests Manager Component
const RequestsManager = ({ onUpdate }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pendiente');

    useEffect(() => {
        loadRequests();
    }, [filter]);

    const loadRequests = async () => {
        try {
            const response = await requestService.getAll();
            if (response.success) {
                const filtered = filter === 'todas' 
                    ? response.solicitudes 
                    : response.solicitudes.filter(r => r.estado === filter);
                setRequests(filtered);
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await requestService.updateStatus(id, newStatus);
            loadRequests();
            onUpdate();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        }
    };

    const getStatusBadge = (estado) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            aprobada: 'bg-green-100 text-green-800',
            rechazada: 'bg-red-100 text-red-800',
            entregada: 'bg-blue-100 text-blue-800'
        };
        return styles[estado] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-8">Cargando solicitudes...</div>;
    }

    return (
        <div>
            {/* Filter */}
            <div className="mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="rechazada">Rechazadas</option>
                    <option value="entregada">Entregadas</option>
                    <option value="todas">Todas</option>
                </select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id_solicitud} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{request.nombre_medicamento}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.estado)}`}>
                                            {request.estado}
                                        </span>
                                        {request.tipo_medicamento === 'con_receta' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                ⚕️ Con Receta
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                                        <div><span className="font-medium">Solicitante:</span> {request.nombre_usuario}</div>
                                        <div><span className="font-medium">Cantidad:</span> {request.cantidad}</div>
                                        <div><span className="font-medium">Fecha:</span> {new Date(request.fecha_solicitud).toLocaleDateString()}</div>
                                        {request.receta_url && (
                                            <div>
                                                <a href={request.receta_url} target="_blank" rel="noopener noreferrer" 
                                                   className="text-blue-600 hover:text-blue-800 font-medium">
                                                    📄 Ver Receta
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {request.estado === 'pendiente' && (
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleStatusChange(request.id_solicitud, 'aprobada')}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(request.id_solicitud, 'rechazada')}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                                {request.estado === 'aprobada' && (
                                    <button
                                        onClick={() => handleStatusChange(request.id_solicitud, 'entregada')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
                                    >
                                        Marcar Entregada
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        No hay solicitudes {filter !== 'todas' ? filter + 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

// Medicines Manager Component
const MedicinesManager = ({ onUpdate }) => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo: 'sin_receta'
    });

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            const response = await medicineService.getAll();
            if (response.success) {
                setMedicines(response.medicamentos);
            }
        } catch (error) {
            console.error('Error al cargar medicamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMedicine) {
                await medicineService.update(editingMedicine.id_medicamento, formData);
            } else {
                await medicineService.create(formData);
            }
            resetForm();
            loadMedicines();
            onUpdate();
        } catch (error) {
            console.error('Error al guardar medicamento:', error);
        }
    };

    const handleEdit = (medicine) => {
        setEditingMedicine(medicine);
        setFormData({
            nombre: medicine.nombre,
            descripcion: medicine.descripcion || '',
            tipo: medicine.tipo
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
            try {
                await medicineService.delete(id);
                loadMedicines();
                onUpdate();
            } catch (error) {
                console.error('Error al eliminar medicamento:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ nombre: '', descripcion: '', tipo: 'sin_receta' });
        setEditingMedicine(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-center py-8">Cargando medicamentos...</div>;
    }

    return (
        <div>
            {/* Add Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancelar' : '+ Agregar Medicamento'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-bold mb-4">
                        {editingMedicine ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo *
                            </label>
                            <select
                                required
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="sin_receta">Sin Receta</option>
                                <option value="con_receta">Con Receta</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {editingMedicine ? 'Actualizar' : 'Crear'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Medicines List */}
            <div className="space-y-3">
                {medicines.map((medicine) => (
                    <div key={medicine.id_medicamento} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold">{medicine.nombre}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        medicine.tipo === 'con_receta' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {medicine.tipo === 'con_receta' ? '⚕️ Con Receta' : '✅ Sin Receta'}
                                    </span>
                                </div>
                                {medicine.descripcion && (
                                    <p className="text-sm text-gray-600 mt-1">{medicine.descripcion}</p>
                                )}
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(medicine)}
                                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(medicine.id_medicamento)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
