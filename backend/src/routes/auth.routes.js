import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middleware/jwt.js';

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout (optional - frontend handles it)
router.post('/logout', authController.logout);

// GET /api/auth/me (requires authentication)
router.get('/me', isAuthenticated, authController.getCurrentUser);

export default router;
