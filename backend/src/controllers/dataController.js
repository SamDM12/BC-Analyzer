import Cliente from '../models/Cliente.js';
import csvParser from '../services/csvParser.js';
import dataValidation from '../services/dataValidation.js';
import fs from 'fs';

class DataController {
  
  // UC-01: Cargar datos
  async uploadData(req, res) {
    try {
      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo'
        });
      }

      const filePath = req.file.path;

      // Paso 1: Parsear archivo
      console.log('Parseando archivo...');
      const data = await csvParser.parseFile(filePath);

      // Paso 2: Validar estructura
      console.log('🔍 Validando estructura...');
      const structureValidation = dataValidation.validateStructure(data);
      if (!structureValidation.valid) {
        // Eliminar archivo temporal
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          message: structureValidation.error
        });
      }

      // Paso 3: Validar datos y generar reporte de calidad
      console.log('Validando datos...');
      const validationStats = dataValidation.validateNulls(data);
      const qualityReport = dataValidation.generateQualityReport(validationStats);

      // Paso 4: Transformar y filtrar datos válidos
      console.log('Transformando datos...');
      const validData = data
        .filter((row, index) => {
          const errors = dataValidation.validateDataTypes(row, index);
          return errors.length === 0 && Object.values(row).every(val => val !== null && val !== undefined && val !== '');
        })
        .map(row => dataValidation.transformData(row));

      // Paso 5: Limpiar datos existentes (opcional - comentar si quieres mantener datos previos)
      // await Cliente.deleteMany({});

      // Paso 6: Insertar en base de datos
      console.log('Guardando en base de datos...');
      const insertedData = await Cliente.insertMany(validData, { ordered: false });

      // Eliminar archivo temporal
      fs.unlinkSync(filePath);

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Datos cargados exitosamente',
        data: {
          registrosInsertados: insertedData.length,
          reporteCalidad: qualityReport
        }
      });

    } catch (error) {
      console.error('Error en uploadData:', error);
      
      // Limpiar archivo si existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Error al cargar datos',
        error: error.message
      });
    }
  }

  // Obtener datos con filtros
  async getData(req, res) {
    try {
      const { age, job, education, month, loan, page = 1, limit = 50 } = req.query;
      
      // Construir filtros dinámicos
      const filters = {};
      if (age) filters.age = parseInt(age);
      if (job) filters.job = job;
      if (education) filters.education = education;
      if (month) filters.month = month;
      if (loan) filters.loan = loan;

      // Calcular paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Obtener datos
      const data = await Cliente.find(filters)
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      // Contar total
      const total = await Cliente.countDocuments(filters);

      res.status(200).json({
        success: true,
        data: {
          registros: data,
          total,
          pagina: parseInt(page),
          totalPaginas: Math.ceil(total / parseInt(limit)),
          registrosPorPagina: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Error en getData:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos',
        error: error.message
      });
    }
  }

  // Obtener estadísticas generales
  async getStats(req, res) {
    try {
      const total = await Cliente.countDocuments();
      const conversiones = await Cliente.countDocuments({ y: 'yes' });
      const tasaConversion = ((conversiones / total) * 100).toFixed(2);

      res.status(200).json({
        success: true,
        data: {
          totalClientes: total,
          totalConversiones: conversiones,
          tasaConversion: parseFloat(tasaConversion)
        }
      });

    } catch (error) {
      console.error('Error en getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
}

export default new DataController();