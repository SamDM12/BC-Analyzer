import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
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
    status: 'running'
  });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    
    // Iniciar servidor solo si la DB está conectada
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
  process.exit(1);
});

export default app;