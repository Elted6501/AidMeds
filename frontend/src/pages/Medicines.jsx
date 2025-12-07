import { useState, useEffect } from 'react';
import { medicineService } from '../services/medicineService';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

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

    const filteredMedicines = medicines.filter(medicine => {
        const matchesSearch = medicine.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || medicine.tipo === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Cargando medicamentos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Catálogo de Medicamentos
                    </h1>
                    <p className="text-gray-600">
                        Explora todos los medicamentos disponibles en el sistema
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar medicamento
                            </label>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de medicamento
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="sin_receta">Sin Receta</option>
                                <option value="con_receta">Con Receta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-gray-600">
                    Mostrando {filteredMedicines.length} de {medicines.length} medicamentos
                </div>

                {/* Medicines Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMedicines.map((medicine) => (
                        <div key={medicine.id_medicamento} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                {/* Badge */}
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        medicine.tipo === 'con_receta' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {medicine.tipo === 'con_receta' ? '⚕️ Con Receta' : '✅ Sin Receta'}
                                    </span>
                                </div>

                                {/* Medicine Name */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {medicine.nombre}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4">
                                    {medicine.descripcion || 'Sin descripción'}
                                </p>

                                {/* Status */}
                                <div className="flex items-center text-sm">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                        medicine.activo ? 'bg-green-500' : 'bg-gray-400'
                                    }`}></span>
                                    <span className="text-gray-600">
                                        {medicine.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredMedicines.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💊</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron medicamentos
                        </h3>
                        <p className="text-gray-600">
                            Intenta con otros términos de búsqueda o filtros
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Medicines;
