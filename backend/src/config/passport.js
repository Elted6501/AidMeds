import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Usuario from '../models/Usuario.js';
import { encryptPassword, matchPassword } from '../utils/helpers.js';

// Local Strategy for Login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await Usuario.findByEmail(email);
        
        if (!user) {
            return done(null, false, { message: 'El email no existe' });
        }

        if (!user.activo) {
            return done(null, false, { message: 'Usuario inactivo' });
        }

        const validPassword = await matchPassword(password, user.password);
        
        if (!validPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Local Strategy for Registration
passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { nombre, apellido, telefono, direccion, id_municipio } = req.body;

        // Validar que el email no exista
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return done(null, false, { message: 'El email ya está registrado' });
        }

        // Validar longitud de password
        if (password.length < 8) {
            return done(null, false, { message: 'La contraseña debe tener al menos 8 caracteres' });
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
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
