import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  // Datos demográficos
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 120
  },
  job: {
    type: String,
    required: true,
    enum: ['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 
           'retired', 'self-employed', 'services', 'student', 'technician', 
           'unemployed', 'unknown']
  },
  marital: {
    type: String,
    required: true,
    enum: ['divorced', 'married', 'single', 'unknown']
  },
  education: {
    type: String,
    required: true,
    enum: ['primary', 'secondary', 'tertiary', 'unknown']
  },
  
  // Información financiera
  default: {
    type: String,
    required: true,
    enum: ['no', 'yes', 'unknown']
  },
  balance: {
    type: Number,
    required: true
  },
  housing: {
    type: String,
    required: true,
    enum: ['no', 'yes', 'unknown']
  },
  loan: {
    type: String,
    required: true,
    enum: ['no', 'yes', 'unknown']
  },
  
  // Información de contacto de la campaña
  contact: {
    type: String,
    required: true,
    enum: ['cellular', 'telephone', 'unknown']
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  month: {
    type: String,
    required: true,
    enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
           'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Información de la campaña
  campaign: {
    type: Number,
    required: true,
    min: 1
  },
  pdays: {
    type: Number,
    required: true
  },
  previous: {
    type: Number,
    required: true,
    min: 0
  },
  poutcome: {
    type: String,
    required: true,
    enum: ['failure', 'other', 'success', 'unknown']
  },
  
  // Resultado
  y: {
    type: String,
    required: true,
    enum: ['no', 'yes']
  }
}, {
  timestamps: true
});

// Índices para mejorar búsquedas
clienteSchema.index({ age: 1 });
clienteSchema.index({ job: 1 });
clienteSchema.index({ education: 1 });
clienteSchema.index({ month: 1 });
clienteSchema.index({ y: 1 });
clienteSchema.index({ balance: 1 });

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;