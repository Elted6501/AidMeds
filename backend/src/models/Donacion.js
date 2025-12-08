import pool from '../config/database.js';

class Donacion {
    static async findAll(filters = {}) {
        let query = `SELECT d.*, 
                     m.nombre as nombre_medicamento, 
                     m.tipo as tipo_medicamento,
                     u.nombre as nombre_usuario, 
                     u.apellido as apellido_usuario
                     FROM donaciones d
                     JOIN medicamentos m ON d.id_medicamento = m.id_medicamento
                     JOIN usuarios u ON d.id_donante = u.id_usuario
                     WHERE 1=1`;
        const params = [];

        if (filters.id_donante) {
            query += ' AND d.id_donante = ?';
            params.push(filters.id_donante);
        }

        if (filters.estatus) {
            query += ' AND d.estatus = ?';
            params.push(filters.estatus);
        }

        query += ' ORDER BY d.created_at DESC';

        return await pool.query(query, params);
    }

    static async findById(id) {
        const [donacion] = await pool.query(
            `SELECT d.*, m.nombre as medicamento_nombre, m.tipo as medicamento_tipo,
                    u.nombre as donante_nombre, u.apellido as donante_apellido
             FROM donaciones d
             JOIN medicamentos m ON d.id_medicamento = m.id_medicamento
             JOIN usuarios u ON d.id_donante = u.id_usuario
             WHERE d.id_donacion = ?`,
            [id]
        );
        return donacion;
    }

    static async findPendientes() {
        return await pool.query('SELECT * FROM view_donaciones_pendientes');
    }

    static async findByDonante(id_donante) {
        return await pool.query(
            `SELECT d.*, m.nombre as medicamento_nombre, m.tipo as medicamento_tipo
             FROM donaciones d
             JOIN medicamentos m ON d.id_medicamento = m.id_medicamento
             WHERE d.id_donante = ?
             ORDER BY d.created_at DESC`,
            [id_donante]
        );
    }

    static async create(donacionData) {
        const {
            id_donante,
            id_medicamento,
            lote,
            fecha_caducidad,
            presentacion,
            miligramos,
            cantidad,
            ruta_imagen
        } = donacionData;

        const result = await pool.query(
            `INSERT INTO donaciones 
             (id_donante, id_medicamento, lote, fecha_caducidad, presentacion, miligramos, cantidad, ruta_imagen)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_donante, id_medicamento, lote, fecha_caducidad, presentacion, miligramos, cantidad, ruta_imagen]
        );

        return result.insertId;
    }

    static async updateEstatus(id, estatus, revisado_por, razon_rechazo = null) {
        await pool.query(
            `UPDATE donaciones 
             SET estatus = ?, revisado_por = ?, razon_rechazo = ?, fecha_revision = NOW()
             WHERE id_donacion = ?`,
            [estatus, revisado_por, razon_rechazo, id]
        );
        return true;
    }

    static async getEstadisticas() {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estatus = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estatus = 'aceptada' THEN 1 ELSE 0 END) as aceptadas,
                SUM(CASE WHEN estatus = 'rechazada' THEN 1 ELSE 0 END) as rechazadas
            FROM donaciones
        `);
        return stats;
    }
}

export default Donacion;
