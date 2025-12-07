import { Router } from 'express';
import * as medicineController from '../controllers/medicine.controller.js';
import { isAuthenticated } from '../middleware/jwt.js';

const router = Router();

// GET /api/medicines (público - usuarios pueden ver medicamentos disponibles)
router.get('/', medicineController.getAllMedicines);

// GET /api/medicines/search
router.get('/search', medicineController.searchMedicines);

// GET /api/medicines/summary (resumen con inventario)
router.get('/summary', medicineController.getInventorySummary);

// GET /api/medicines/:id
router.get('/:id', medicineController.getMedicineById);

// Las siguientes rutas requieren autenticación y ser admin
router.use(isAuthenticated);

// POST /api/medicines (solo admins)
router.post('/', medicineController.createMedicine);

// PUT /api/medicines/:id (solo admins)
router.put('/:id', medicineController.updateMedicine);

// DELETE /api/medicines/:id (solo admins)
router.delete('/:id', medicineController.deactivateMedicine);

export default router;
