const { Schema, model } = require('mongoose');
const SER_INVENCIBLE_AREAS = require('./ser_invencible_areas');

// Subesquema para registrar progreso (0–100%)
const subProgreso = new Schema({
  porcentaje: { type: Number, min: 0, max: 100, required: true },
  fecha:      { type: Date,   required: true }
}, { _id: false });

// Subesquema para hitos intermedios
const subHito = new Schema({
  titulo:           { type: String,  required: true },
  fechaInicioHito:  { type: Date,    required: true },
  fechaFinHito:     { type: Date,    required: true },
  completado:       { type: Boolean, default: false }
}, { _id: false });

// Subesquema para notas adicionales
const subNota = new Schema({
  texto: { type: String, required: true },
  fecha: { type: Date,   required: true }
}, { _id: false });

//Subesquema para areas ser invencible
const SubAreaVidaSchema = new Schema({
  titulo: {
    type: String,
    enum: SER_INVENCIBLE_AREAS.map(a => a.titulo),
    required: true
  },
  icono: {
    type: String,
    // enum: SER_INVENCIBLE_AREAS.map(a => a.icono),
    required: true
  }
}, { _id: false });

// Esquema principal de Objetivo Personal
const ObjetivoPersonalSchema = new Schema({
  usuario: {
    type:    Schema.Types.ObjectId,
    ref:     'Usuario',
    required:true
  },
  titulo:         { type: String, required: true },
  tipo:           { type: Number, required: true },
  descripcion:    { type: String, default: null },
  beneficios:     { type: String, default: null },
  fechaCreacion:  { type: Date,   default: Date.now },
  fechaObjetivo:  { type: Date,   required: true },
  completado:     { type: Boolean, default: false },
  areaSerInvencible: { type: [SubAreaVidaSchema], required: true },
  progreso:       { type: [subProgreso], default: [], validate: arr => Array.isArray(arr) },
  hitos:          { type: [subHito],     default: [], validate: arr => Array.isArray(arr) },
  notas:          { type: [subNota],     default: [], validate: arr => Array.isArray(arr) }
}, {
  timestamps: true
});

module.exports = model('ObjetivoPersonal', ObjetivoPersonalSchema);