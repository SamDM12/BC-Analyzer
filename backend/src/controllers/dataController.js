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
      const { 
        // Filtros básicos
        age, job, education, month, loan, marital, housing, contact, poutcome, y,
        // Filtros de rango
        ageMin, ageMax, durationMin, durationMax,
        // Paginación
        page = 1, limit = 50,
        // Ordenamiento
        sortBy = 'age', 
        sortOrder = 'asc'
      } = req.query;
      
      // Construir filtros dinámicos
      const filters = {};
      
      // Filtros simples
      if (age) filters.age = parseInt(age);
      if (job) filters.job = job;
      if (education) filters.education = education;
      if (month) filters.month = month;
      if (loan) filters.loan = loan;
      if (marital) filters.marital = marital;
      if (housing) filters.housing = housing;
      if (contact) filters.contact = contact;
      if (poutcome) filters.poutcome = poutcome;
      if (y) filters.y = y;
      
      // Filtros de rango
      if (ageMin || ageMax) {
        filters.age = {};
        if (ageMin) filters.age.$gte = parseInt(ageMin);
        if (ageMax) filters.age.$lte = parseInt(ageMax);
      }
      
      if (durationMin || durationMax) {
        filters.duration = {};
        if (durationMin) filters.duration.$gte = parseInt(durationMin);
        if (durationMax) filters.duration.$lte = parseInt(durationMax);
      }

      // Construir ordenamiento
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calcular paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Obtener datos
      const data = await Cliente.find(filters)
        .sort(sort)
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
          registrosPorPagina: parseInt(limit),
          filtrosAplicados: filters,
          ordenamiento: { campo: sortBy, orden: sortOrder }
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

  // NUEVO: Obtener opciones de filtros
  async getFilterOptions(req, res) {
    try {
      const { field } = req.params;
      
      const validFields = ['job', 'education', 'marital', 'housing', 'loan', 'contact', 'month', 'poutcome', 'y'];
      
      if (!validFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: 'Campo no válido para filtro'
        });
      }
      
      const values = await Cliente.distinct(field);
      
      res.status(200).json({
        success: true,
        data: {
          field,
          values: values.sort()
        }
      });
      
    } catch (error) {
      console.error('Error en getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener opciones de filtro',
        error: error.message
      });
    }
  }

  // NUEVO: Obtener rangos para filtros numéricos
  async getFilterRanges(req, res) {
    try {
      const ageRange = await Cliente.aggregate([
        { $group: { _id: null, min: { $min: '$age' }, max: { $max: '$age' } } }
      ]);

      const durationRange = await Cliente.aggregate([
        { $group: { _id: null, min: { $min: '$duration' }, max: { $max: '$duration' } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          age: ageRange[0] || { min: 18, max: 100 },
          duration: durationRange[0] || { min: 0, max: 5000 }
        }
      });

    } catch (error) {
      console.error('Error en getFilterRanges:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener rangos',
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