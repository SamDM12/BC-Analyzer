import mongoose from 'mongoose';

const consultaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  filtros: {
    type: Object,
    default: {}
  },
  descripcion: {
    type: String,
    trim: true
  },
  resultados: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Consulta = mongoose.model('Consulta', consultaSchema);

export default Consulta;