import { Router } from 'express';
import * as donationController from '../controllers/donation.controller.js';
import { isAuthenticated } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

// GET /api/donations
router.get('/', donationController.getAllDonations);

// GET /api/donations/pending (para admins)
router.get('/pending', donationController.getPendingDonations);

// GET /api/donations/stats (para admins)
router.get('/stats', donationController.getDonationStats);

// GET /api/donations/:id
router.get('/:id', donationController.getDonationById);

// POST /api/donations (con imagen)
router.post('/', upload.single('imagen'), donationController.createDonation);

// PUT /api/donations/:id/accept (solo admins)
router.put('/:id/accept', donationController.acceptDonation);

// PUT /api/donations/:id/reject (solo admins)
router.put('/:id/reject', donationController.rejectDonation);

export default router;
