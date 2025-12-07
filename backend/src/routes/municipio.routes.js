import { Router } from 'express';
import * as municipioController from '../controllers/municipio.controller.js';

const router = Router();

// GET /api/municipios (público)
router.get('/', municipioController.getAllMunicipios);

// GET /api/municipios/:id
router.get('/:id', municipioController.getMunicipioById);

export default router;
