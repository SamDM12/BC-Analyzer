import Cliente from '../models/Cliente.js';

class KPIService {
  
  // KPI 1: Tasa de conversión general
  async getConversionRate(filters = {}) {
    try {
      const total = await Cliente.countDocuments(filters);
      const conversions = await Cliente.countDocuments({ ...filters, y: 'yes' });
      
      const rate = total > 0 ? ((conversions / total) * 100).toFixed(2) : 0;
      
      return {
        total,
        conversions,
        conversionRate: parseFloat(rate)
      };
    } catch (error) {
      throw new Error(`Error calculando tasa de conversión: ${error.message}`);
    }
  }

  // KPI 2: Distribución de clientes por edad
  async getAgeDistribution(filters = {}) {
    try {
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $bucket: {
            groupBy: '$age',
            boundaries: [18, 25, 35, 45, 55, 65, 100],
            default: 'Otros',
            output: {
              count: { $sum: 1 },
              avgBalance: { 
                $avg: { 
                  $cond: [{ $ne: ['$balance', null] }, '$balance', 0]
                }
              },
              conversions: {
                $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
              }
            }
          }
        }
      ]);

      return distribution.map(bucket => ({
        range: `${bucket._id}-${bucket._id === 65 ? '+' : bucket._id + 9}`,
        count: bucket.count,
        avgBalance: bucket.avgBalance ? parseFloat(bucket.avgBalance.toFixed(2)) : 0,
        conversions: bucket.conversions,
        conversionRate: parseFloat(((bucket.conversions / bucket.count) * 100).toFixed(2))
      }));
    } catch (error) {
      throw new Error(`Error en distribución por edad: ${error.message}`);
    }
  }

  // KPI 3: Distribución por trabajo
  async getJobDistribution(filters = {}) {
    try {
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$job',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgDuration: { 
              $avg: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            },
            avgBalance: { 
              $avg: { 
                $cond: [{ $ne: ['$balance', null] }, '$balance', 0]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return distribution.map(item => ({
        job: item._id,
        count: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgDuration: item.avgDuration ? parseFloat(item.avgDuration.toFixed(2)) : 0,
        avgBalance: item.avgBalance ? parseFloat(item.avgBalance.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en distribución por trabajo: ${error.message}`);
    }
  }

  // KPI 4: Distribución por educación
  async getEducationDistribution(filters = {}) {
    try {
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$education',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgBalance: { 
              $avg: { 
                $cond: [{ $ne: ['$balance', null] }, '$balance', 0]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return distribution.map(item => ({
        education: item._id,
        count: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgBalance: item.avgBalance ? parseFloat(item.avgBalance.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en distribución por educación: ${error.message}`);
    }
  }

  // KPI 5: Distribución por canal de contacto
  async getContactDistribution(filters = {}) {
    try {
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$contact',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgDuration: { 
              $avg: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return distribution.map(item => ({
        channel: item._id,
        count: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgDuration: item.avgDuration ? parseFloat(item.avgDuration.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en distribución por canal: ${error.message}`);
    }
  }

  // KPI 6: Distribución por mes
  async getMonthDistribution(filters = {}) {
    try {
      const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$month',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgDuration: { 
              $avg: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            }
          }
        }
      ]);

      // Ordenar por mes
      const sorted = distribution.sort((a, b) => 
        monthOrder.indexOf(a._id) - monthOrder.indexOf(b._id)
      );

      return sorted.map(item => ({
        month: item._id,
        count: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgDuration: item.avgDuration ? parseFloat(item.avgDuration.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en distribución por mes: ${error.message}`);
    }
  }

  // KPI 7: Métricas generales
  async getGeneralMetrics(filters = {}) {
    try {
      const metrics = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: null,
            totalClients: { $sum: 1 },
            totalConversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgDuration: { 
              $avg: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            },
            avgBalance: { 
              $avg: { 
                $cond: [{ $ne: ['$balance', null] }, '$balance', 0]
              }
            },
            avgCampaign: { 
              $avg: { 
                $cond: [{ $ne: ['$campaign', null] }, '$campaign', 0]
              }
            },
            avgPrevious: { 
              $avg: { 
                $cond: [{ $ne: ['$previous', null] }, '$previous', 0]
              }
            },
            totalDuration: { 
              $sum: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            }
          }
        }
      ]);

      if (metrics.length === 0) {
        return {
          totalClients: 0,
          totalConversions: 0,
          conversionRate: 0,
          avgDuration: 0,
          avgBalance: 0,
          avgCampaign: 0,
          avgPrevious: 0,
          totalDuration: 0
        };
      }

      const data = metrics[0];
      return {
        totalClients: data.totalClients,
        totalConversions: data.totalConversions,
        conversionRate: parseFloat(((data.totalConversions / data.totalClients) * 100).toFixed(2)),
        avgDuration: data.avgDuration ? parseFloat(data.avgDuration.toFixed(2)) : 0,
        avgBalance: data.avgBalance ? parseFloat(data.avgBalance.toFixed(2)) : 0,
        avgCampaign: data.avgCampaign ? parseFloat(data.avgCampaign.toFixed(2)) : 0,
        avgPrevious: data.avgPrevious ? parseFloat(data.avgPrevious.toFixed(2)) : 0,
        totalDuration: data.totalDuration || 0
      };
    } catch (error) {
      throw new Error(`Error en métricas generales: ${error.message}`);
    }
  }

  // KPI 8: Distribución por estado civil
  async getMaritalDistribution(filters = {}) {
    try {
      const distribution = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$marital',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgBalance: { 
              $avg: { 
                $cond: [{ $ne: ['$balance', null] }, '$balance', 0]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return distribution.map(item => ({
        marital: item._id,
        count: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgBalance: item.avgBalance ? parseFloat(item.avgBalance.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en distribución por estado civil: ${error.message}`);
    }
  }

  // KPI 9: Top clientes por balance
  async getTopClientsByBalance(filters = {}, limit = 10) {
    try {
      const topClients = await Cliente.find(filters)
        .sort({ balance: -1 })
        .limit(limit)
        .select('age job education balance y duration')
        .lean();

      return topClients;
    } catch (error) {
      throw new Error(`Error obteniendo top clientes: ${error.message}`);
    }
  }

  // KPI 10: Análisis de campañas
  async getCampaignAnalysis(filters = {}) {
    try {
      const analysis = await Cliente.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$campaign',
            count: { $sum: 1 },
            conversions: {
              $sum: { $cond: [{ $eq: ['$y', 'yes'] }, 1, 0] }
            },
            avgDuration: { 
              $avg: { 
                $cond: [{ $ne: ['$duration', null] }, '$duration', 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 10 }
      ]);

      return analysis.map(item => ({
        campaignNumber: item._id,
        contacts: item.count,
        conversions: item.conversions,
        conversionRate: parseFloat(((item.conversions / item.count) * 100).toFixed(2)),
        avgDuration: item.avgDuration ? parseFloat(item.avgDuration.toFixed(2)) : 0
      }));
    } catch (error) {
      throw new Error(`Error en análisis de campañas: ${error.message}`);
    }
  }

  // Método principal que devuelve todos los KPIs
  async getAllKPIs(filters = {}) {
    try {
      const [
        generalMetrics,
        ageDistribution,
        jobDistribution,
        educationDistribution,
        contactDistribution,
        monthDistribution,
        maritalDistribution,
        campaignAnalysis
      ] = await Promise.all([
        this.getGeneralMetrics(filters),
        this.getAgeDistribution(filters),
        this.getJobDistribution(filters),
        this.getEducationDistribution(filters),
        this.getContactDistribution(filters),
        this.getMonthDistribution(filters),
        this.getMaritalDistribution(filters),
        this.getCampaignAnalysis(filters)
      ]);

      return {
        generalMetrics,
        distributions: {
          age: ageDistribution,
          job: jobDistribution,
          education: educationDistribution,
          contact: contactDistribution,
          month: monthDistribution,
          marital: maritalDistribution
        },
        campaignAnalysis
      };
    } catch (error) {
      throw new Error(`Error obteniendo todos los KPIs: ${error.message}`);
    }
  }
}

export default new KPIService();