import Usuario from '../models/Usuario.js';
import { encryptPassword, matchPassword } from '../utils/helpers.js';

export const getProfile = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id_usuario);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No enviar password
        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, telefono, direccion, id_municipio } = req.body;

        await Usuario.update(req.user.id_usuario, {
            nombre,
            apellido,
            telefono,
            direccion,
            id_municipio
        });

        const updatedUser = await Usuario.findById(req.user.id_usuario);
        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validar password actual
        const user = await Usuario.findById(req.user.id_usuario);
        const validPassword = await matchPassword(currentPassword, user.password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        // Validar longitud nueva contraseña
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 8 caracteres'
            });
        }

        // Encriptar y actualizar
        const hashedPassword = await encryptPassword(newPassword);
        await Usuario.updatePassword(req.user.id_usuario, hashedPassword);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar contraseña',
            error: error.message
        });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        // Validar password antes de eliminar
        const user = await Usuario.findById(req.user.id_usuario);
        const validPassword = await matchPassword(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        // Marcar como inactivo en lugar de eliminar
        await Usuario.setInactive(req.user.id_usuario);

        // Cerrar sesión
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }

            res.json({
                success: true,
                message: 'Cuenta desactivada exitosamente'
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cuenta',
            error: error.message
        });
    }
};
