import Inventario from '../models/Inventario.js';

export const getAllInventory = async (req, res) => {
    try {
        // Solo admins pueden ver inventario completo
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const inventario = await Inventario.findAll();

        res.json({
            success: true,
            count: inventario.length,
            inventario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener inventario',
            error: error.message
        });
    }
};

export const getInventoryByMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await Inventario.findByMedicamento(id);

        res.json({
            success: true,
            count: inventario.length,
            inventario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener inventario',
            error: error.message
        });
    }
};

export const getExpiringMedicines = async (req, res) => {
    try {
        const { dias } = req.query;
        const diasInt = dias ? parseInt(dias) : 90;

        const medicamentos = await Inventario.findProximosAVencer(diasInt);

        res.json({
            success: true,
            count: medicamentos.length,
            medicamentos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener medicamentos próximos a vencer',
            error: error.message
        });
    }
};

export const getExpiredMedicines = async (req, res) => {
    try {
        const medicamentos = await Inventario.findVencidos();

        res.json({
            success: true,
            count: medicamentos.length,
            medicamentos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener medicamentos vencidos',
            error: error.message
        });
    }
};

export const adjustInventory = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const { cantidad_nueva, motivo } = req.body;

        if (cantidad_nueva < 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor o igual a 0'
            });
        }

        if (!motivo) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un motivo para el ajuste'
            });
        }

        await Inventario.ajustarCantidad(id, cantidad_nueva, motivo, req.user.id_usuario);

        res.json({
            success: true,
            message: 'Inventario ajustado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al ajustar inventario',
            error: error.message
        });
    }
};

export const markAsExpired = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;

        await Inventario.marcarComoVencido(id, req.user.id_usuario);

        res.json({
            success: true,
            message: 'Medicamento marcado como vencido y dado de baja'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al marcar medicamento como vencido',
            error: error.message
        });
    }
};

export const getInventorySummary = async (req, res) => {
    try {
        const resumen = await Inventario.getResumen();

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

export const getInventoryStats = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const stats = await Inventario.getEstadisticas();

        res.json({
            success: true,
            estadisticas: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};
