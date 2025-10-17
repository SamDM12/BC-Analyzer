import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import dataRoutes from './routes/dataRoutes.js';  // ← NUEVO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'BC Analyzer API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      data: '/api/data',
      upload: '/api/data/upload',
      stats: '/api/data/stats'
    }
  });
});

// Rutas de la API  ← NUEVO
app.use('/api/data', dataRoutes);

// Conectar a la base de datos e iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
  });
});

process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
  process.exit(1);
});

export default app;