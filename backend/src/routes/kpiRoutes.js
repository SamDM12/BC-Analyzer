import express from 'express';
import kpiController from '../controllers/kpiController.js';

const router = express.Router();

// GET /api/kpis - Obtener todos los KPIs
router.get('/', kpiController.getAllKPIs);

// GET /api/kpis/general - Métricas generales
router.get('/general', kpiController.getGeneralMetrics);

// GET /api/kpis/age - Distribución por edad
router.get('/age', kpiController.getAgeDistribution);

// GET /api/kpis/job - Distribución por trabajo
router.get('/job', kpiController.getJobDistribution);

// GET /api/kpis/education - Distribución por educación
router.get('/education', kpiController.getEducationDistribution);

// GET /api/kpis/contact - Distribución por canal
router.get('/contact', kpiController.getContactDistribution);

// GET /api/kpis/month - Distribución por mes
router.get('/month', kpiController.getMonthDistribution);

// GET /api/kpis/marital - Distribución por estado civil
router.get('/marital', kpiController.getMaritalDistribution);

// GET /api/kpis/campaign - Análisis de campañas
router.get('/campaign', kpiController.getCampaignAnalysis);

export default router;