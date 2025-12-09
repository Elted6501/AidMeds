import Donacion from '../models/Donacion.js';
import Medicamento from '../models/Medicamento.js';
import fs from 'fs-extra';

export const getAllDonations = async (req, res) => {
    try {
        const { estatus, id_donante } = req.query;
        const filters = {};

        // Si es user, solo ve sus donaciones
        if (req.user.rol === 'user') {
            filters.id_donante = req.user.id_usuario;
        }

        if (estatus) {
            filters.estatus = estatus;
        }

        // Filtro por donante (solo para admin)
        if (id_donante && (req.user.rol === 'admin' || req.user.rol === 'super_admin')) {
            filters.id_donante = parseInt(id_donante);
        }

        const donaciones = await Donacion.findAll(filters);

        res.json({
            success: true,
            count: donaciones.length,
            donaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener donaciones',
            error: error.message
        });
    }
};

export const getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        const donacion = await Donacion.findById(id);

        if (!donacion) {
            return res.status(404).json({
                success: false,
                message: 'Donación no encontrada'
            });
        }

        // Verificar permisos: solo el donante o admin pueden ver
        if (req.user.rol === 'user' && donacion.id_donante !== req.user.id_usuario) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta donación'
            });
        }

        res.json({
            success: true,
            donacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener donación',
            error: error.message
        });
    }
};

export const getPendingDonations = async (req, res) => {
    try {
        // Solo admins pueden ver donaciones pendientes de todos
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const donaciones = await Donacion.findPendientes();

        res.json({
            success: true,
            count: donaciones.length,
            donaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener donaciones pendientes',
            error: error.message
        });
    }
};

export const createDonation = async (req, res) => {
    try {
        const {
            id_medicamento,
            lote,
            fecha_caducidad,
            presentacion,
            miligramos,
            cantidad
        } = req.body;

        // Validar campos requeridos
        if (!id_medicamento || !fecha_caducidad || !presentacion || !miligramos || !cantidad) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: id_medicamento, fecha_caducidad, presentacion, miligramos, cantidad'
            });
        }

        // Validar que el medicamento existe
        const medicamento = await Medicamento.findById(id_medicamento);
        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }

        // Validar presentacion
        const presentacionesValidas = ['tableta', 'capsula', 'jarabe', 'suspension', 'ampolleta', 'crema', 'gel', 'ungüento', 'supositorio', 'ovulo', 'parche', 'inhalador', 'solucion', 'polvo'];
        if (!presentacionesValidas.includes(presentacion)) {
            return res.status(400).json({
                success: false,
                message: 'Presentación no válida'
            });
        }

        // Validar que la fecha de caducidad sea futura
        const fechaCad = new Date(fecha_caducidad);
        if (fechaCad < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de caducidad debe ser futura'
            });
        }

        // Obtener ruta de imagen si se subió
        const ruta_imagen = req.file ? req.file.path : null;

        const donacionId = await Donacion.create({
            id_donante: req.user.id_usuario,
            id_medicamento,
            lote: lote ? lote.toUpperCase() : null,
            fecha_caducidad,
            presentacion,
            miligramos,
            cantidad,
            ruta_imagen
        });

        const donacion = await Donacion.findById(donacionId);

        res.status(201).json({
            success: true,
            message: 'Donación creada exitosamente',
            donacion
        });
    } catch (error) {
        // Si hay error, eliminar imagen subida
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear donación',
            error: error.message
        });
    }
};

export const acceptDonation = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const donacion = await Donacion.findById(id);

        if (!donacion) {
            return res.status(404).json({
                success: false,
                message: 'Donación no encontrada'
            });
        }

        if (donacion.estatus !== 'pendiente') {
            return res.status(400).json({
                success: false,
                message: 'La donación ya fue procesada'
            });
        }

        await Donacion.updateEstatus(id, 'aceptada', req.user.id_usuario);

        res.json({
            success: true,
            message: 'Donación aceptada. Se agregó al inventario automáticamente.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al aceptar donación',
            error: error.message
        });
    }
};

export const rejectDonation = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const { razon_rechazo } = req.body;

        if (!razon_rechazo) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar una razón de rechazo'
            });
        }

        const donacion = await Donacion.findById(id);

        if (!donacion) {
            return res.status(404).json({
                success: false,
                message: 'Donación no encontrada'
            });
        }

        if (donacion.estatus !== 'pendiente') {
            return res.status(400).json({
                success: false,
                message: 'La donación ya fue procesada'
            });
        }

        await Donacion.updateEstatus(id, 'rechazada', req.user.id_usuario, razon_rechazo);

        res.json({
            success: true,
            message: 'Donación rechazada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al rechazar donación',
            error: error.message
        });
    }
};

export const getDonationStats = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const stats = await Donacion.getEstadisticas();

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
