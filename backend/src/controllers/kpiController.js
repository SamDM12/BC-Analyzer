import kpiService from '../services/kpiService.js';

// Función auxiliar para construir filtros (fuera de la clase)
const buildFilters = (query) => {
  const filters = {};
  
  // Filtros simples
  if (query.age) filters.age = parseInt(query.age);
  if (query.job) filters.job = query.job;
  if (query.education) filters.education = query.education;
  if (query.month) filters.month = query.month;
  if (query.loan) filters.loan = query.loan;
  if (query.marital) filters.marital = query.marital;
  if (query.housing) filters.housing = query.housing;
  if (query.contact) filters.contact = query.contact;
  if (query.poutcome) filters.poutcome = query.poutcome;
  if (query.y) filters.y = query.y;
  
  // Filtros de rango
  if (query.ageMin || query.ageMax) {
    filters.age = {};
    if (query.ageMin) filters.age.$gte = parseInt(query.ageMin);
    if (query.ageMax) filters.age.$lte = parseInt(query.ageMax);
  }
  
  if (query.balanceMin || query.balanceMax) {
    filters.balance = {};
    if (query.balanceMin) filters.balance.$gte = parseFloat(query.balanceMin);
    if (query.balanceMax) filters.balance.$lte = parseFloat(query.balanceMax);
  }
  
  return filters;
};

class KPIController {

  // GET /api/kpis - Obtener todos los KPIs
  async getAllKPIs(req, res) {
    try {
      const filters = buildFilters(req.query);
      const kpis = await kpiService.getAllKPIs(filters);

      res.status(200).json({
        success: true,
        data: kpis,
        filtrosAplicados: filters
      });
    } catch (error) {
      console.error('Error en getAllKPIs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener KPIs',
        error: error.message
      });
    }
  }

  // GET /api/kpis/general - Métricas generales
  async getGeneralMetrics(req, res) {
    try {
      const filters = buildFilters(req.query);
      const metrics = await kpiService.getGeneralMetrics(filters);

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error en getGeneralMetrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener métricas generales',
        error: error.message
      });
    }
  }

  // GET /api/kpis/age - Distribución por edad
  async getAgeDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getAgeDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getAgeDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por edad',
        error: error.message
      });
    }
  }

  // GET /api/kpis/job - Distribución por trabajo
  async getJobDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getJobDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getJobDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por trabajo',
        error: error.message
      });
    }
  }

  // GET /api/kpis/education - Distribución por educación
  async getEducationDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getEducationDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getEducationDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por educación',
        error: error.message
      });
    }
  }

  // GET /api/kpis/contact - Distribución por canal
  async getContactDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getContactDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getContactDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por canal',
        error: error.message
      });
    }
  }

  // GET /api/kpis/month - Distribución por mes
  async getMonthDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getMonthDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getMonthDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por mes',
        error: error.message
      });
    }
  }

  // GET /api/kpis/marital - Distribución por estado civil
  async getMaritalDistribution(req, res) {
    try {
      const filters = buildFilters(req.query);
      const distribution = await kpiService.getMaritalDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      console.error('Error en getMaritalDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por estado civil',
        error: error.message
      });
    }
  }

  // GET /api/kpis/campaign - Análisis de campañas
  async getCampaignAnalysis(req, res) {
    try {
      const filters = buildFilters(req.query);
      const analysis = await kpiService.getCampaignAnalysis(filters);

      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error en getCampaignAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener análisis de campañas',
        error: error.message
      });
    }
  }

  // GET /api/kpis/cards - KPIs principales para el dashboard
  async getDashboardKPIs(req, res) {
    try {
      const filters = buildFilters(req.query);

      // Traer los datos necesarios
      const conversionRateData = await kpiService.getConversionRate(filters);
      const generalMetrics = await kpiService.getGeneralMetrics(filters);

      // Duración media de llamadas exitosas (solo y: 'yes')
      const avgDurationSuccessful = await kpiService.getAvgDurationSuccessfulCalls(filters);

      // Preparar la respuesta
      const kpis = {
        conversionRate: conversionRateData.conversionRate, // %
        totalContacts: generalMetrics.totalClients,
        successfulCalls: generalMetrics.totalConversions,
        avgDuration: avgDurationSuccessful // en segundos
      };

      res.status(200).json({
        success: true,
        data: kpis
      });
    } catch (error) {
      console.error('Error en getDashboardKPIs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener KPIs del dashboard',
        error: error.message
      });
    }
  }
}

export default new KPIController();