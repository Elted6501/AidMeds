import pool from '../config/database.js';

class Medicamento {
    static async findAll(activo = true) {
        const query = activo 
            ? 'SELECT * FROM medicamentos WHERE activo = TRUE ORDER BY nombre'
            : 'SELECT * FROM medicamentos ORDER BY nombre';
        
        return await pool.query(query);
    }

    static async findById(id) {
        const [medicamento] = await pool.query(
            'SELECT * FROM medicamentos WHERE id_medicamento = ?',
            [id]
        );
        return medicamento;
    }

    static async findByName(nombre) {
        return await pool.query(
            'SELECT * FROM medicamentos WHERE nombre LIKE ? AND activo = TRUE',
            [`%${nombre}%`]
        );
    }

    static async findByTipo(tipo) {
        return await pool.query(
            'SELECT * FROM medicamentos WHERE tipo = ? AND activo = TRUE ORDER BY nombre',
            [tipo]
        );
    }

    static async create(medicamentoData) {
        const { nombre, tipo, descripcion } = medicamentoData;
        
        const result = await pool.query(
            'INSERT INTO medicamentos (nombre, tipo, descripcion, created_at) VALUES (?, ?, ?, NOW())',
            [nombre, tipo, descripcion]
        );
        
        return result.insertId;
    }

    static async update(id, medicamentoData) {
        const { nombre, tipo, descripcion } = medicamentoData;
        
        await pool.query(
            'UPDATE medicamentos SET nombre = ?, tipo = ?, descripcion = ? WHERE id_medicamento = ?',
            [nombre, tipo, descripcion, id]
        );
        
        return true;
    }

    static async setInactive(id) {
        await pool.query(
            'UPDATE medicamentos SET activo = FALSE WHERE id_medicamento = ?',
            [id]
        );
        return true;
    }

    static async getResumenInventario() {
        return await pool.query('SELECT * FROM view_resumen_inventario');
    }
}

export default Medicamento;
