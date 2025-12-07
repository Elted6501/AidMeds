import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { isAuthenticated } from '../middleware/jwt.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

// GET /api/inventory (solo admins)
router.get('/', inventoryController.getAllInventory);

// GET /api/inventory/summary (resumen disponible para todos)
router.get('/summary', inventoryController.getInventorySummary);

// GET /api/inventory/expiring (medicamentos próximos a vencer)
router.get('/expiring', inventoryController.getExpiringMedicines);

// GET /api/inventory/expired (medicamentos vencidos)
router.get('/expired', inventoryController.getExpiredMedicines);

// GET /api/inventory/stats (solo admins)
router.get('/stats', inventoryController.getInventoryStats);

// GET /api/inventory/medicine/:id (por medicamento)
router.get('/medicine/:id', inventoryController.getInventoryByMedicine);

// PUT /api/inventory/:id/adjust (solo admins)
router.put('/:id/adjust', inventoryController.adjustInventory);

// PUT /api/inventory/:id/expire (solo admins)
router.put('/:id/expire', inventoryController.markAsExpired);

export default router;
