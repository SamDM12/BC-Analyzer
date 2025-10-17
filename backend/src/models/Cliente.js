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
    enum: ['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 
           'illiterate', 'professional.course', 'university.degree', 'unknown']
  },
  
  // Información financiera
  default: {
    type: String,
    required: true,
    enum: ['no', 'yes', 'unknown']
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
    enum: ['cellular', 'telephone']
  },
  month: {
    type: String,
    required: true,
    enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
           'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  },
  day_of_week: {
    type: String,
    required: true,
    enum: ['mon', 'tue', 'wed', 'thu', 'fri']
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
    enum: ['failure', 'nonexistent', 'success']
  },
  
  // Indicadores económicos
  emp_var_rate: {
    type: Number,
    required: true
  },
  cons_price_idx: {
    type: Number,
    required: true
  },
  cons_conf_idx: {
    type: Number,
    required: true
  },
  euribor3m: {
    type: Number,
    required: true
  },
  nr_employed: {
    type: Number,
    required: true
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

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;