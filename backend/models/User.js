const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  password: String,
  tipoUsuario: { type: String, enum: ['Deportista', 'Tecnico', 'Delegado'], default: 'Deportista' },
  foto: String,
  verified: { type: Boolean, default: false },
verificationToken: String,

});

module.exports = mongoose.model('User', userSchema);
