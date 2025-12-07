import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile
router.put('/profile', userController.updateProfile);

// PUT /api/users/password
router.put('/password', userController.updatePassword);

// DELETE /api/users/profile
router.delete('/profile', userController.deleteAccount);

export default router;
