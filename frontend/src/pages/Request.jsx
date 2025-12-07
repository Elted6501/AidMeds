import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { medicineService } from '../services/medicineService';

const Request = () => {
    const [medicines, setMedicines] = useState([]);
    const [formData, setFormData] = useState({
        id_medicamento: '',
        cantidad: '',
        receta: null
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
                receta: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const selectedMedicine = medicines.find(m => m.id_medicamento === parseInt(formData.id_medicamento));
            
            // Validate prescription for controlled medicines
            if (selectedMedicine?.tipo === 'con_receta' && !formData.receta) {
                setError('Este medicamento requiere receta médica');
                setLoading(false);
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('id_medicamento', formData.id_medicamento);
            formDataToSend.append('cantidad', formData.cantidad);
            if (formData.receta) {
                formDataToSend.append('receta', formData.receta);
            }

            const response = await requestService.create(formDataToSend);
            
            if (response.success) {
                setSuccess('¡Solicitud registrada exitosamente! Te contactaremos pronto.');
                setFormData({
                    id_medicamento: '',
                    cantidad: '',
                    receta: null
                });
                // Reset file input
                if (document.getElementById('receta')) {
                    document.getElementById('receta').value = '';
                }
                
                setTimeout(() => {
                    navigate('/my-requests');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al registrar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const selectedMedicine = medicines.find(m => m.id_medicamento === parseInt(formData.id_medicamento));
    const requiresPrescription = selectedMedicine?.tipo === 'con_receta';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Solicitar Medicamentos
                    </h1>
                    <p className="text-gray-600">
                        Solicita los medicamentos que necesitas de forma gratuita
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <div className="text-blue-600 text-2xl mr-3">ℹ️</div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">
                                Información importante
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Los medicamentos se entregan en la sede física</li>
                                <li>• Medicamentos con receta requieren presentar la receta médica</li>
                                <li>• Las solicitudes son revisadas por el equipo administrativo</li>
                                <li>• Te contactaremos cuando tu solicitud sea aprobada</li>
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
                                        {medicine.nombre} - {medicine.tipo === 'con_receta' ? '⚕️ Con Receta' : '✅ Sin Receta'}
                                    </option>
                                ))}
                            </select>
                            {selectedMedicine && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        {selectedMedicine.descripcion}
                                    </p>
                                    {requiresPrescription && (
                                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                            <p className="text-sm text-yellow-800 font-medium">
                                                ⚠️ Este medicamento requiere receta médica
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad (unidades o cajas) *
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
                                placeholder="Ejemplo: 1, 2, 3..."
                            />
                        </div>

                        {/* Prescription Upload */}
                        <div>
                            <label htmlFor="receta" className="block text-sm font-medium text-gray-700 mb-2">
                                Receta Médica {requiresPrescription ? '*' : '(opcional)'}
                            </label>
                            <input
                                id="receta"
                                name="receta"
                                type="file"
                                accept="image/*,application/pdf"
                                required={requiresPrescription}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleFileChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Formatos: JPG, PNG, PDF. Tamaño máximo: 5MB
                            </p>
                            {requiresPrescription && (
                                <p className="mt-1 text-sm text-red-600">
                                    * Requerido para medicamentos con receta
                                </p>
                            )}
                        </div>

                        {/* Warning Box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="text-gray-600 text-xl mr-3">📍</div>
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium mb-1">Recolección en sede física</p>
                                    <p>
                                        Una vez aprobada tu solicitud, deberás acudir a la sede física
                                        para recoger los medicamentos. Te enviaremos la dirección y horarios
                                        por correo electrónico.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Enviando solicitud...' : 'Solicitar Medicamento'}
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

export default Request;
