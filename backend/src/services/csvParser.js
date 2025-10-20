import Papa from 'papaparse';
import fs from 'fs';
import XLSX from 'xlsx';

class CSVParserService {
  
  // Parsear archivo CSV
  // Parsear archivo CSV
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: ';',  // ← CAMBIO IMPORTANTE: punto y coma
        complete: (results) => {
            // Limpiar comillas de los headers y valores
            const cleanedData = results.data.map(row => {
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                const cleanKey = key.replace(/"/g, '').trim();
                const value = row[key];
                cleanRow[cleanKey] = typeof value === 'string' ? value.replace(/"/g, '').trim() : value;
            });
            return cleanRow;
            });
            resolve(cleanedData);
        },
        error: (error) => {
            reject(new Error(`Error parseando CSV: ${error.message}`));
        }
        });
    });
    }

  // Parsear archivo Excel
  async parseExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      return data;
    } catch (error) {
      throw new Error(`Error parseando Excel: ${error.message}`);
    }
  }

  // Detectar tipo de archivo y parsear
  async parseFile(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
      return await this.parseCSV(filePath);
    } else if (extension === 'xlsx' || extension === 'xls') {
      return await this.parseExcel(filePath);
    } else {
      throw new Error('Formato de archivo no soportado. Use CSV o Excel.');
    }
  }
}

export default new CSVParserService();