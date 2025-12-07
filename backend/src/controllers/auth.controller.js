import passport from 'passport';

export const register = (req, res, next) => {
    passport.authenticate('local.register', (err, user, info) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error en el servidor',
                error: err.message 
            });
        }
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: info.message || 'Error al registrar usuario' 
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al iniciar sesión automáticamente' 
                });
            }

            // No enviar password en la respuesta
            const { password, ...userWithoutPassword } = user;
            
            return res.status(201).json({ 
                success: true, 
                message: 'Usuario registrado exitosamente',
                user: userWithoutPassword 
            });
        });
    })(req, res, next);
};

export const login = (req, res, next) => {
    passport.authenticate('local.login', (err, user, info) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error en el servidor',
                error: err.message 
            });
        }
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: info.message || 'Credenciales inválidas' 
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al iniciar sesión' 
                });
            }

            // No enviar password en la respuesta
            const { password, ...userWithoutPassword } = user;
            
            return res.json({ 
                success: true, 
                message: 'Sesión iniciada exitosamente',
                user: userWithoutPassword 
            });
        });
    })(req, res, next);
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Sesión cerrada exitosamente' 
        });
    });
};

export const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'No autenticado' 
        });
    }

    // No enviar password en la respuesta
    const { password, ...userWithoutPassword } = req.user;
    
    res.json({ 
        success: true, 
        user: userWithoutPassword 
    });
};
