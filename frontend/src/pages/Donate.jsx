import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { medicineService } from '../services/medicineService';

const Donate = () => {
    const [medicines, setMedicines] = useState([]);
    const [formData, setFormData] = useState({
        id_medicamento: '',
        lote: '',
        fecha_caducidad: '',
        presentacion: '',
        miligramos: '',
        cantidad: '',
        imagen: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }
            setFormData({
                ...formData,
                imagen: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id_medicamento', formData.id_medicamento);
            formDataToSend.append('lote', formData.lote);
            formDataToSend.append('fecha_caducidad', formData.fecha_caducidad);
            formDataToSend.append('presentacion', formData.presentacion);
            formDataToSend.append('miligramos', formData.miligramos);
            formDataToSend.append('cantidad', formData.cantidad);
            if (formData.imagen) {
                formDataToSend.append('imagen', formData.imagen);
            }

            const response = await donationService.create(formDataToSend);
            
            if (response.success) {
                setSuccess('¡Donación registrada exitosamente!');
                setFormData({
                    id_medicamento: '',
                    lote: '',
                    fecha_caducidad: '',
                    presentacion: '',
                    miligramos: '',
                    cantidad: '',
                    imagen: null
                });
                // Reset file input
                document.getElementById('imagen').value = '';
                
                setTimeout(() => {
                    navigate('/my-donations');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al registrar la donación');
        } finally {
            setLoading(false);
        }
    };

    const selectedMedicine = medicines.find(m => m.id_medicamento === parseInt(formData.id_medicamento));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Donar Medicamentos
                    </h1>
                    <p className="text-gray-600">
                        Ayuda a quien más lo necesita donando medicamentos que ya no uses
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <div className="text-blue-600 text-2xl mr-3">ℹ️</div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">
                                Requisitos para donar
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Medicamentos en buen estado</li>
                                <li>• Fecha de caducidad vigente (mínimo 3 meses)</li>
                                <li>• Envase original y sellado (preferible)</li>
                                <li>• Foto clara del medicamento</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {success}
                            </div>
                        )}

                        {/* Medicine Selection */}
                        <div>
                            <label htmlFor="id_medicamento" className="block text-sm font-medium text-gray-700 mb-2">
                                Medicamento *
                            </label>
                            <select
                                id="id_medicamento"
                                name="id_medicamento"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.id_medicamento}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona un medicamento</option>
                                {medicines.map((medicine) => (
                                    <option key={medicine.id_medicamento} value={medicine.id_medicamento}>
                                        {medicine.nombre} - {medicine.tipo === 'con_receta' ? 'Con Receta' : 'Sin Receta'}
                                    </option>
                                ))}
                            </select>
                            {selectedMedicine && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {selectedMedicine.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Lote */}
                        <div>
                            <label htmlFor="lote" className="block text-sm font-medium text-gray-700 mb-2">
                                Número de Lote *
                            </label>
                            <input
                                id="lote"
                                name="lote"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.lote}
                                onChange={handleChange}
                                placeholder="Ej: ABC123"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Número de lote que aparece en el empaque del medicamento
                            </p>
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label htmlFor="fecha_caducidad" className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Caducidad *
                            </label>
                            <input
                                id="fecha_caducidad"
                                name="fecha_caducidad"
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.fecha_caducidad}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Presentacion */}
                        <div>
                            <label htmlFor="presentacion" className="block text-sm font-medium text-gray-700 mb-2">
                                Presentación *
                            </label>
                            <select
                                id="presentacion"
                                name="presentacion"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.presentacion}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona la presentación</option>
                                <option value="tableta">Tableta</option>
                                <option value="capsula">Cápsula</option>
                                <option value="jarabe">Jarabe</option>
                                <option value="suspension">Suspensión</option>
                                <option value="ampolleta">Ampolleta</option>
                                <option value="crema">Crema</option>
                                <option value="gel">Gel</option>
                                <option value="ungüento">Ungüento</option>
                                <option value="supositorio">Supositorio</option>
                                <option value="ovulo">Óvulo</option>
                                <option value="parche">Parche</option>
                                <option value="inhalador">Inhalador</option>
                                <option value="solucion">Solución</option>
                                <option value="polvo">Polvo</option>
                            </select>
                        </div>

                        {/* Miligramos */}
                        <div>
                            <label htmlFor="miligramos" className="block text-sm font-medium text-gray-700 mb-2">
                                Concentración (mg) *
                            </label>
                            <input
                                id="miligramos"
                                name="miligramos"
                                type="number"
                                min="1"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.miligramos}
                                onChange={handleChange}
                                placeholder="Ej: 500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Concentración en miligramos por unidad (tableta, cápsula, ml, etc.)
                            </p>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad de Unidades *
                            </label>
                            <input
                                id="cantidad"
                                name="cantidad"
                                type="number"
                                min="1"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.cantidad}
                                onChange={handleChange}
                                placeholder="Ej: 10"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Número de tabletas, cápsulas, ml, etc. que deseas donar
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen del Medicamento (opcional)
                            </label>
                            <input
                                id="imagen"
                                name="imagen"
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleFileChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Formatos: JPG, PNG. Tamaño máximo: 5MB
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Registrando...' : 'Donar Medicamento'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-300 rounded-md font-semibold hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Donate;
