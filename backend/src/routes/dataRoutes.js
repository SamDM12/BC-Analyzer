import express from 'express';
import dataController from '../controllers/dataController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/data/upload - Cargar datos desde CSV/Excel
router.post('/upload', upload.single('file'), dataController.uploadData);

// GET /api/data/stats - Obtener estadísticas generales
router.get('/stats', dataController.getStats);

// GET /api/data/filters/ranges - Obtener rangos (ANTES de /:field)
router.get('/filters/ranges', dataController.getFilterRanges);

// GET /api/data/filters/:field - Obtener valores únicos para un filtro (DESPUÉS)
router.get('/filters/:field', dataController.getFilterOptions);

// GET /api/data - Obtener datos con filtros y ordenamiento (AL FINAL)
router.get('/', dataController.getData);

export default router;