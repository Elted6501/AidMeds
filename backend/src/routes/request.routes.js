import { Router } from 'express';
import * as requestController from '../controllers/request.controller.js';
import { isAuthenticated } from '../middleware/jwt.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

// GET /api/requests
router.get('/', requestController.getAllRequests);

// GET /api/requests/pending (para admins)
router.get('/pending', requestController.getPendingRequests);

// GET /api/requests/stats (para admins)
router.get('/stats', requestController.getRequestStats);

// GET /api/requests/:id
router.get('/:id', requestController.getRequestById);

// POST /api/requests (con receta si requiere)
router.post('/', upload.single('receta'), requestController.createRequest);

// PUT /api/requests/:id/approve (solo admins)
router.put('/:id/approve', requestController.approveRequest);

// PUT /api/requests/:id/reject (solo admins)
router.put('/:id/reject', requestController.rejectRequest);

// PUT /api/requests/:id/deliver (solo admins)
router.put('/:id/deliver', requestController.deliverRequest);

export default router;
