import Medicamento from '../models/Medicamento.js';

export const getAllMedicines = async (req, res) => {
    try {
        const { tipo, activo } = req.query;
        
        let medicamentos;
        
        if (tipo) {
            medicamentos = await Medicamento.findByTipo(tipo);
        } else {
            medicamentos = await Medicamento.findAll(activo !== 'false');
        }

        res.json({
            success: true,
            count: medicamentos.length,
            medicamentos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener medicamentos',
            error: error.message
        });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicamento = await Medicamento.findById(id);

        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }

        res.json({
            success: true,
            medicamento
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener medicamento',
            error: error.message
        });
    }
};

export const searchMedicines = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un nombre para buscar'
            });
        }

        const medicamentos = await Medicamento.findByName(nombre);

        res.json({
            success: true,
            count: medicamentos.length,
            medicamentos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar medicamentos',
            error: error.message
        });
    }
};

export const createMedicine = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { nombre, tipo, descripcion } = req.body;

        const medicamentoId = await Medicamento.create({
            nombre,
            tipo,
            descripcion
        });

        const medicamento = await Medicamento.findById(medicamentoId);

        res.status(201).json({
            success: true,
            message: 'Medicamento creado exitosamente',
            medicamento
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear medicamento',
            error: error.message
        });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const { nombre, tipo, descripcion } = req.body;

        const medicamento = await Medicamento.findById(id);
        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }

        await Medicamento.update(id, {
            nombre,
            tipo,
            descripcion
        });

        const updatedMedicamento = await Medicamento.findById(id);

        res.json({
            success: true,
            message: 'Medicamento actualizado exitosamente',
            medicamento: updatedMedicamento
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar medicamento',
            error: error.message
        });
    }
};

export const deactivateMedicine = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;

        const medicamento = await Medicamento.findById(id);
        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }

        await Medicamento.setInactive(id);

        res.json({
            success: true,
            message: 'Medicamento desactivado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al desactivar medicamento',
            error: error.message
        });
    }
};

export const getInventorySummary = async (req, res) => {
    try {
        const resumen = await Medicamento.getResumenInventario();

        res.json({
            success: true,
            resumen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen de inventario',
            error: error.message
        });
    }
};
