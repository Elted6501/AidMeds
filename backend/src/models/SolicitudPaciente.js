import pool from '../config/database.js';

class SolicitudPaciente {
    static async findAll(filters = {}) {
        let query = `SELECT s.*, 
                     m.nombre as nombre_medicamento, 
                     m.tipo as tipo_medicamento,
                     u.nombre as nombre_usuario, 
                     u.apellido as apellido_usuario
                     FROM solicitudes_paciente s
                     JOIN medicamentos m ON s.id_medicamento = m.id_medicamento
                     JOIN usuarios u ON s.id_paciente = u.id_usuario
                     WHERE 1=1`;
        const params = [];

        if (filters.id_paciente) {
            query += ' AND s.id_paciente = ?';
            params.push(filters.id_paciente);
        }

        if (filters.estatus) {
            query += ' AND s.estatus = ?';
            params.push(filters.estatus);
        }

        query += ' ORDER BY s.created_at DESC';

        return await pool.query(query, params);
    }

    static async findById(id) {
        const [solicitud] = await pool.query(
            `SELECT s.*, m.nombre as medicamento_nombre, m.tipo as medicamento_tipo,
                    u.nombre as paciente_nombre, u.apellido as paciente_apellido
             FROM solicitudes_paciente s
             JOIN medicamentos m ON s.id_medicamento = m.id_medicamento
             JOIN usuarios u ON s.id_paciente = u.id_usuario
             WHERE s.id_solicitud = ?`,
            [id]
        );
        return solicitud;
    }

    static async findPendientes() {
        return await pool.query('SELECT * FROM view_solicitudes_pendientes');
    }

    static async findByPaciente(id_paciente) {
        return await pool.query(
            `SELECT s.*, m.nombre as medicamento_nombre, m.tipo as medicamento_tipo
             FROM solicitudes_paciente s
             JOIN medicamentos m ON s.id_medicamento = m.id_medicamento
             WHERE s.id_paciente = ?
             ORDER BY s.created_at DESC`,
            [id_paciente]
        );
    }

    static async create(solicitudData) {
        const {
            id_paciente,
            id_medicamento,
            cantidad_solicitada,
            ruta_receta,
            motivo
        } = solicitudData;

        const result = await pool.query(
            `INSERT INTO solicitudes_paciente 
             (id_paciente, id_medicamento, cantidad_solicitada, ruta_receta, motivo, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [id_paciente, id_medicamento, cantidad_solicitada, ruta_receta, motivo]
        );

        return result.insertId;
    }

    static async updateEstatus(id, estatus, revisado_por, razon_rechazo = null) {
        await pool.query(
            `UPDATE solicitudes_paciente 
             SET estatus = ?, revisado_por = ?, razon_rechazo = ?, fecha_revision = NOW(), updated_at = NOW()
             WHERE id_solicitud = ?`,
            [estatus, revisado_por, razon_rechazo, id]
        );
        return true;
    }

    static async marcarComoEntregada(id, revisado_por) {
        await pool.query(
            `UPDATE solicitudes_paciente 
             SET estatus = 'entregada', revisado_por = ?, fecha_entrega = NOW(), updated_at = NOW()
             WHERE id_solicitud = ?`,
            [revisado_por, id]
        );
        return true;
    }

    static async verificarDisponibilidad(id_medicamento, cantidad) {
        const [result] = await pool.query(
            `SELECT SUM(cantidad_actual) as disponible 
             FROM inventario 
             WHERE id_medicamento = ? AND cantidad_actual > 0`,
            [id_medicamento]
        );
        return result.disponible >= cantidad;
    }

    static async getEstadisticas() {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estatus = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estatus = 'aprobada' THEN 1 ELSE 0 END) as aprobadas,
                SUM(CASE WHEN estatus = 'rechazada' THEN 1 ELSE 0 END) as rechazadas,
                SUM(CASE WHEN estatus = 'entregada' THEN 1 ELSE 0 END) as entregadas
            FROM solicitudes_paciente
        `);
        return stats;
    }
}

export default SolicitudPaciente;
