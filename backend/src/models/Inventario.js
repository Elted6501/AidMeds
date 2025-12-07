import pool from '../config/database.js';

class Inventario {
    static async findAll() {
        return await pool.query('SELECT * FROM view_inventario_disponible');
    }

    static async findById(id) {
        const [item] = await pool.query(
            `SELECT i.*, m.nombre as medicamento_nombre, m.tipo as medicamento_tipo
             FROM inventario i
             JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
             WHERE i.id_inventario = ?`,
            [id]
        );
        return item;
    }

    static async findByMedicamento(id_medicamento) {
        return await pool.query(
            `SELECT * FROM inventario 
             WHERE id_medicamento = ? AND cantidad_actual > 0
             ORDER BY fecha_caducidad ASC`,
            [id_medicamento]
        );
    }

    static async findProximosAVencer(dias = 90) {
        return await pool.query(
            `SELECT i.*, m.nombre as medicamento_nombre
             FROM inventario i
             JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
             WHERE i.cantidad_actual > 0 
               AND i.fecha_caducidad BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
             ORDER BY i.fecha_caducidad ASC`,
            [dias]
        );
    }

    static async findVencidos() {
        return await pool.query(
            `SELECT i.*, m.nombre as medicamento_nombre
             FROM inventario i
             JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
             WHERE i.cantidad_actual > 0 AND i.fecha_caducidad < CURDATE()
             ORDER BY i.fecha_caducidad ASC`
        );
    }

    static async ajustarCantidad(id, cantidad_nueva, motivo, realizado_por) {
        const [item] = await pool.query(
            'SELECT cantidad_actual FROM inventario WHERE id_inventario = ?',
            [id]
        );

        if (!item) {
            throw new Error('Item de inventario no encontrado');
        }

        await pool.query(
            'UPDATE inventario SET cantidad_actual = ?, updated_at = NOW() WHERE id_inventario = ?',
            [cantidad_nueva, id]
        );

        // Registrar movimiento
        await pool.query(
            `INSERT INTO movimientos 
             (id_inventario, tipo, cantidad, cantidad_anterior, cantidad_nueva, motivo, realizado_por, created_at)
             VALUES (?, 'ajuste', ?, ?, ?, ?, ?, NOW())`,
            [id, Math.abs(cantidad_nueva - item.cantidad_actual), item.cantidad_actual, cantidad_nueva, motivo, realizado_por]
        );

        return true;
    }

    static async marcarComoVencido(id, realizado_por) {
        const [item] = await pool.query(
            'SELECT cantidad_actual FROM inventario WHERE id_inventario = ?',
            [id]
        );

        if (!item) {
            throw new Error('Item de inventario no encontrado');
        }

        await pool.query(
            'UPDATE inventario SET cantidad_actual = 0, updated_at = NOW() WHERE id_inventario = ?',
            [id]
        );

        // Registrar movimiento
        await pool.query(
            `INSERT INTO movimientos 
             (id_inventario, tipo, cantidad, cantidad_anterior, cantidad_nueva, motivo, realizado_por, created_at)
             VALUES (?, 'vencido', ?, ?, 0, 'Medicamento vencido dado de baja', ?, NOW())`,
            [id, item.cantidad_actual, item.cantidad_actual, realizado_por]
        );

        return true;
    }

    static async getResumen() {
        return await pool.query('SELECT * FROM view_resumen_inventario');
    }

    static async getEstadisticas() {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total_lotes,
                SUM(cantidad_actual) as total_unidades,
                COUNT(DISTINCT id_medicamento) as total_medicamentos,
                SUM(CASE WHEN fecha_caducidad < CURDATE() THEN cantidad_actual ELSE 0 END) as unidades_vencidas,
                SUM(CASE WHEN fecha_caducidad BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) THEN cantidad_actual ELSE 0 END) as unidades_por_vencer
            FROM inventario
            WHERE cantidad_actual > 0
        `);
        return stats;
    }
}

export default Inventario;
