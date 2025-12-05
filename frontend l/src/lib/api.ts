import axios from "axios";

// Base URL configurada en .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Instancia única de axios para TODA la app
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: agrega el token a TODAS las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------------------
//         TIPOS
// -------------------------------

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
  sortOrder?: "asc" | "desc";
}

// -------------------------------
//     ENDPOINTS DE AUTENTICACIÓN
// -------------------------------

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const registerUser = (data: any) =>
  api.post("/auth/register", data).then((res) => res.data);

// -------------------------------
//             DATA
// -------------------------------

export const uploadData = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/data/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getData = async (params: FilterParams = {}) => {
  const response = await api.get("/data", { params });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/data/stats");
  return response.data;
};

export const getFilterOptions = async (field: string) => {
  const response = await api.get(`/data/filters/${field}`);
  return response.data;
};

export const getFilterRanges = async () => {
  const response = await api.get("/data/filters/ranges");
  return response.data;
};

// -------------------------------
//             KPIS
// -------------------------------

export const getAllKPIs = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis", { params });
  return response.data;
};

export const getGeneralMetrics = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/general", { params });
  return response.data;
};

export const getAgeDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/age", { params });
  return response.data;
};

export const getJobDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/job", { params });
  return response.data;
};

export const getEducationDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/education", { params });
  return response.data;
};

export const getContactDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/contact", { params });
  return response.data;
};

export const getMonthDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/month", { params });
  return response.data;
};

export const getMaritalDistribution = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/marital", { params });
  return response.data;
};

export const getCampaignAnalysis = async (params: FilterParams = {}) => {
  const response = await api.get("/kpis/campaign", { params });
  return response.data;
};



export default api;
