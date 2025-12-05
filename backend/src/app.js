import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

import dataRoutes from './routes/dataRoutes.js'; 
import kpiRoutes from './routes/kpiRoutes.js';
import authRoutes from './routes/authRoutes.js';   // 👈 FALTA ESTO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'BC Analyzer API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      data: '/api/data',
      kpis: '/api/kpis',
      auth: '/api/auth'  // 👈 OPCIONAL
    }
  });
});

// RUTAS
app.use('/api/auth', authRoutes);   // 👈 AÑADE ESTO
app.use('/api/data', dataRoutes);
app.use('/api/kpis', kpiRoutes);

// Conexión
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
