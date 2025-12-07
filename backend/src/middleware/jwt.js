import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aidmeds_jwt_secret_change_in_production';

// Generate JWT token
export const generateToken = (user) => {
    const payload = {
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.rol
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// JWT Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Admin access required'
    });
};
