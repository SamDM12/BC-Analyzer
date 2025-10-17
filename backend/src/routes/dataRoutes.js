import express from 'express';
import dataController from '../controllers/dataController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/data/upload - Cargar datos desde CSV/Excel
router.post('/upload', upload.single('file'), dataController.uploadData);

// GET /api/data - Obtener datos con filtros
router.get('/', dataController.getData);

// GET /api/data/stats - Obtener estadísticas generales
router.get('/stats', dataController.getStats);

export default router;