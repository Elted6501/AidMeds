export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
    });
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Already authenticated' 
    });
};
