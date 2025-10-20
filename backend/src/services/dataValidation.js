class DataValidationService {
  
  // Validar estructura del archivo CSV
  // Validar estructura del archivo CSV
  validateStructure(data) {
    const requiredColumns = [
        'age', 'job', 'marital', 'education', 'default', 'balance', 'housing', 'loan',
        'contact', 'day', 'month', 'duration', 'campaign', 'pdays',
        'previous', 'poutcome', 'y'
    ];

    if (!data || data.length === 0) {
        return {
        valid: false,
        error: 'El archivo está vacío'
        };
    }

    const fileColumns = Object.keys(data[0]);
    console.log('📋 Columnas encontradas en el CSV:', fileColumns);

    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));

    if (missingColumns.length > 0) {
        return {
        valid: false,
        error: `Columnas faltantes: ${missingColumns.join(', ')}`
        };
    }

    return { valid: true };
  }

  // Validar tipos de datos
  // Validar tipos de datos
  validateDataTypes(row, index) {
    const errors = [];

    // Validar edad
    if (isNaN(row.age) || row.age < 18 || row.age > 120) {
        errors.push(`Fila ${index + 1}: Edad inválida (${row.age})`);
    }

    // Validar balance
    if (row.balance === null || row.balance === undefined) {
        errors.push(`Fila ${index + 1}: Balance faltante`);
    }

    // Validar duración
    if (isNaN(row.duration) || row.duration < 0) {
        errors.push(`Fila ${index + 1}: Duración inválida (${row.duration})`);
    }

    // Validar campaign
    if (isNaN(row.campaign) || row.campaign < 1) {
        errors.push(`Fila ${index + 1}: Campaign inválido (${row.campaign})`);
    }

    // Validar día
    if (isNaN(row.day) || row.day < 1 || row.day > 31) {
        errors.push(`Fila ${index + 1}: Día inválido (${row.day})`);
    }

    return errors;
  }

  // Identificar registros nulos o inconsistentes
  validateNulls(data) {
    const stats = {
      totalRows: data.length,
      validRows: 0,
      invalidRows: 0,
      nullFields: {},
      errors: []
    };

    data.forEach((row, index) => {
      let hasNulls = false;
      
      Object.keys(row).forEach(key => {
        if (row[key] === null || row[key] === undefined || row[key] === '') {
          hasNulls = true;
          stats.nullFields[key] = (stats.nullFields[key] || 0) + 1;
        }
      });

      // Validar tipos de datos
      const typeErrors = this.validateDataTypes(row, index);
      if (typeErrors.length > 0) {
        stats.errors.push(...typeErrors);
        hasNulls = true;
      }

      if (hasNulls) {
        stats.invalidRows++;
      } else {
        stats.validRows++;
      }
    });

    return stats;
  }

  // Generar reporte de calidad
  generateQualityReport(stats) {
    const qualityPercentage = ((stats.validRows / stats.totalRows) * 100).toFixed(2);

    return {
      totalRegistros: stats.totalRows,
      registrosValidos: stats.validRows,
      registrosInvalidos: stats.invalidRows,
      calidadPorcentaje: parseFloat(qualityPercentage),
      camposConNulos: stats.nullFields,
      errores: stats.errors.slice(0, 10) // Solo primeros 10 errores
    };
  }

  // Transformar datos para MongoDB (normalizar nombres de campos)
  // Transformar datos para MongoDB (normalizar nombres de campos)
  transformData(row) {
    return {
        age: parseInt(row.age),
        job: row.job,
        marital: row.marital,
        education: row.education,
        default: row.default,
        balance: parseFloat(row.balance),
        housing: row.housing,
        loan: row.loan,
        contact: row.contact,
        day: parseInt(row.day),
        month: row.month,
        duration: parseInt(row.duration),
        campaign: parseInt(row.campaign),
        pdays: parseInt(row.pdays),
        previous: parseInt(row.previous),
        poutcome: row.poutcome,
        y: row.y
    };
 }
}

export default new DataValidationService();