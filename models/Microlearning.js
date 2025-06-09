const { Schema, model } = require('mongoose');

const AreaInvencibleSchema = new Schema({
  titulo: { type: String, required: true },
  icono:  { type: String, required: true }
}, { _id: false });

const MicroLearningSchema = new Schema({
  titulo:            { type: String, required: true },
  textoCorto:        { type: String, required: true },
  textoLargo:        { type: String, required: true },
  icono:             { type: String, required: true },
  imagen:            { type: String, required: false },
  vecesSeleccionado: { type: Number, default: 0 },
  areaInvencibleObj: { type: AreaInvencibleSchema, required: true } // ← Añadido
}, { timestamps: true });

module.exports = model('Microlearning', MicroLearningSchema);