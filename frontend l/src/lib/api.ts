import axios from 'axios';

// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instancia de axios configurada
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos
export interface ClienteData {
  _id: string;
  age: number;
  job: string;
  marital: string;
  education: string;
  default: string;
  balance: number;
  housing: string;
  loan: string;
  contact: string;
  day: number;
  month: string;
  duration: number;
  campaign: number;
  pdays: number;
  previous: number;
  poutcome: string;
  y: string;
}

export interface KPIMetrics {
  totalClients: number;
  totalConversions: number;
  conversionRate: number;
  avgDuration: number;
  avgBalance: number;
  avgCampaign: number;
  avgPrevious: number;
  totalDuration: number;
}

export interface FilterParams {
  age?: number;
  job?: string;
  education?: string;
  month?: string;
  loan?: string;
  marital?: string;
  housing?: string;
  contact?: string;
  poutcome?: string;
  y?: string;
  ageMin?: number;
  ageMax?: number;
  balanceMin?: number;
  balanceMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Endpoints

// 1. Upload de datos
export const uploadData = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/data/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// 2. Obtener datos con filtros
export const getData = async (params: FilterParams = {}) => {
  const response = await api.get('/data', { params });
  return response.data;
};

// 3. Obtener estadísticas generales
export const getStats = async () => {
  const response = await api.get('/data/stats');
  return response.data;
};

// 4. Obtener todos los KPIs
export const getAllKPIs = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis', { params });
  return response.data;
};

// 5. Obtener métricas generales
export const getGeneralMetrics = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/general', { params });
  return response.data;
};

// 6. Obtener distribución por edad
export const getAgeDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/age', { params });
  return response.data;
};

// 7. Obtener distribución por trabajo
export const getJobDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/job', { params });
  return response.data;
};

// 8. Obtener distribución por educación
export const getEducationDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/education', { params });
  return response.data;
};

// 9. Obtener distribución por canal
export const getContactDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/contact', { params });
  return response.data;
};

// 10. Obtener distribución por mes
export const getMonthDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/month', { params });
  return response.data;
};

// 11. Obtener distribución por estado civil
export const getMaritalDistribution = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/marital', { params });
  return response.data;
};

// 12. Obtener análisis de campañas
export const getCampaignAnalysis = async (params: FilterParams = {}) => {
  const response = await api.get('/kpis/campaign', { params });
  return response.data;
};

// 13. Obtener opciones de filtros
export const getFilterOptions = async (field: string) => {
  const response = await api.get(`/data/filters/${field}`);
  return response.data;
};

// 14. Obtener rangos de filtros
export const getFilterRanges = async () => {
  const response = await api.get('/data/filters/ranges');
  return response.data;
};