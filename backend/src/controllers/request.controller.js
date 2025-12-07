import SolicitudPaciente from '../models/SolicitudPaciente.js';
import Medicamento from '../models/Medicamento.js';
import fs from 'fs-extra';

export const getAllRequests = async (req, res) => {
    try {
        const { estatus } = req.query;
        const filters = {};

        // Si es user, solo ve sus solicitudes
        if (req.user.rol === 'user') {
            filters.id_paciente = req.user.id_usuario;
        }

        if (estatus) {
            filters.estatus = estatus;
        }

        const solicitudes = await SolicitudPaciente.findAll(filters);

        res.json({
            success: true,
            count: solicitudes.length,
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener solicitudes',
            error: error.message
        });
    }
};

export const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await SolicitudPaciente.findById(id);

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada'
            });
        }

        // Verificar permisos
        if (req.user.rol === 'user' && solicitud.id_paciente !== req.user.id_usuario) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta solicitud'
            });
        }

        res.json({
            success: true,
            solicitud
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener solicitud',
            error: error.message
        });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const solicitudes = await SolicitudPaciente.findPendientes();

        res.json({
            success: true,
            count: solicitudes.length,
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener solicitudes pendientes',
            error: error.message
        });
    }
};

export const createRequest = async (req, res) => {
    try {
        const {
            id_medicamento,
            cantidad_solicitada,
            motivo
        } = req.body;

        // Validar que el medicamento existe
        const medicamento = await Medicamento.findById(id_medicamento);
        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }

        // Verificar disponibilidad en inventario
        const disponible = await SolicitudPaciente.verificarDisponibilidad(id_medicamento, cantidad_solicitada);
        if (!disponible) {
            return res.status(400).json({
                success: false,
                message: 'No hay suficiente stock disponible'
            });
        }

        // Si el medicamento requiere receta, debe subir archivo
        if (medicamento.tipo === 'con_receta' && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Este medicamento requiere receta médica'
            });
        }

        const ruta_receta = req.file ? req.file.path : null;

        const solicitudId = await SolicitudPaciente.create({
            id_paciente: req.user.id_usuario,
            id_medicamento,
            cantidad_solicitada,
            ruta_receta,
            motivo
        });

        const solicitud = await SolicitudPaciente.findById(solicitudId);

        res.status(201).json({
            success: true,
            message: 'Solicitud creada exitosamente',
            solicitud
        });
    } catch (error) {
        // Si hay error, eliminar archivo subido
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear solicitud',
            error: error.message
        });
    }
};

export const approveRequest = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const solicitud = await SolicitudPaciente.findById(id);

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada'
            });
        }

        if (solicitud.estatus !== 'pendiente') {
            return res.status(400).json({
                success: false,
                message: 'La solicitud ya fue procesada'
            });
        }

        // Verificar disponibilidad nuevamente
        const disponible = await SolicitudPaciente.verificarDisponibilidad(
            solicitud.id_medicamento,
            solicitud.cantidad_solicitada
        );

        if (!disponible) {
            return res.status(400).json({
                success: false,
                message: 'No hay suficiente stock disponible'
            });
        }

        await SolicitudPaciente.updateEstatus(id, 'aprobada', req.user.id_usuario);

        res.json({
            success: true,
            message: 'Solicitud aprobada. El paciente puede recoger el medicamento.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al aprobar solicitud',
            error: error.message
        });
    }
};

export const rejectRequest = async (req, res) => {
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

        const solicitud = await SolicitudPaciente.findById(id);

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada'
            });
        }

        if (solicitud.estatus !== 'pendiente') {
            return res.status(400).json({
                success: false,
                message: 'La solicitud ya fue procesada'
            });
        }

        await SolicitudPaciente.updateEstatus(id, 'rechazada', req.user.id_usuario, razon_rechazo);

        res.json({
            success: true,
            message: 'Solicitud rechazada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al rechazar solicitud',
            error: error.message
        });
    }
};

export const deliverRequest = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const { id } = req.params;
        const solicitud = await SolicitudPaciente.findById(id);

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada'
            });
        }

        if (solicitud.estatus !== 'aprobada') {
            return res.status(400).json({
                success: false,
                message: 'La solicitud debe estar aprobada para entregarla'
            });
        }

        // El trigger se encarga de reducir el inventario
        await SolicitudPaciente.marcarComoEntregada(id, req.user.id_usuario);

        res.json({
            success: true,
            message: 'Entrega registrada. El inventario se actualizó automáticamente.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar entrega',
            error: error.message
        });
    }
};

export const getRequestStats = async (req, res) => {
    try {
        // Solo admins
        if (req.user.rol !== 'admin' && req.user.rol !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para esta acción'
            });
        }

        const stats = await SolicitudPaciente.getEstadisticas();

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
