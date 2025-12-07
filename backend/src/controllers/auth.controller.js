import Usuario from '../models/Usuario.js';
import { encryptPassword, matchPassword } from '../utils/helpers.js';
import { generateToken } from '../middleware/jwt.js';

export const register = async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, direccion, id_municipio } = req.body;

        // Validar que el email no exista
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Validar longitud de password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        // Encriptar password
        const hashedPassword = await encryptPassword(password);

        // Crear usuario
        const userId = await Usuario.create({
            nombre,
            apellido,
            email,
            password: hashedPassword,
            telefono,
            direccion,
            id_municipio,
            rol: 'user'
        });

        const newUser = await Usuario.findById(userId);

        // Generar JWT token
        const token = generateToken(newUser);

        // No enviar password en la respuesta
        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await Usuario.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (!user.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }

        // Verificar password
        const validPassword = await matchPassword(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar JWT token
        const token = generateToken(user);

        // No enviar password en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            success: true,
            message: 'Sesión iniciada exitosamente',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

export const logout = (req, res) => {
    // Con JWT, el logout es manejado en el frontend (eliminar token)
    res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
    });
};

export const getCurrentUser = async (req, res) => {
    try {
        // req.user ya viene del middleware JWT
        const user = await Usuario.findById(req.user.id_usuario);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No enviar password en la respuesta
        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};
