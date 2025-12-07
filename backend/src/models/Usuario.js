import pool from '../config/database.js';

class Usuario {
    static async findById(id) {
        const [user] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return user;
    }

    static async findByEmail(email) {
        const [user] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return user;
    }

    static async create(userData) {
        const { nombre, apellido, email, password, telefono, direccion, id_municipio, rol = 'user' } = userData;
        
        const result = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, id_municipio, rol, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [nombre, apellido, email, password, telefono, direccion, id_municipio, rol]
        );
        
        return result.insertId;
    }

    static async update(id, userData) {
        const { nombre, apellido, telefono, direccion, id_municipio } = userData;
        
        await pool.query(
            `UPDATE usuarios 
             SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, id_municipio = ?, updated_at = NOW()
             WHERE id_usuario = ?`,
            [nombre, apellido, telefono, direccion, id_municipio, id]
        );
        
        return true;
    }

    static async updatePassword(id, newPassword) {
        await pool.query(
            'UPDATE usuarios SET password = ?, updated_at = NOW() WHERE id_usuario = ?',
            [newPassword, id]
        );
        return true;
    }

    static async delete(id) {
        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        return true;
    }

    static async setInactive(id) {
        await pool.query(
            'UPDATE usuarios SET activo = FALSE, updated_at = NOW() WHERE id_usuario = ?',
            [id]
        );
        return true;
    }
}

export default Usuario;
