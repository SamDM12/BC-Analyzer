import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  tipoUsuario: {
    type: String,
    enum: {
      values: ['DIRECTIVO', 'ANALISTA_DATOS', 'EQUIPO_TECNICO'],
      message: '{VALUE} no es un tipo de usuario válido'
    },
    default: 'ANALISTA_DATOS'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Método para no devolver el password en las respuestas
usuarioSchema.methods.toJSON = function() {
  const usuario = this.toObject();
  delete usuario.password;
  return usuario;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;