const { Schema, model } = require('mongoose');

const subRating = new Schema({
  nota:  { type: Number, min: 1, max: 5, required: true },
  fecha: { type: Date, required: true }
}, { _id: false });

const subCompletion = new Schema({
  completado: { type: Boolean, required: true },
  fecha:      { type: Date,    required: true }
}, { _id: false });

const subMantra = new Schema({
  texto:             { type: String, required: true },
  vecesSeleccionado: { type: Number, default: 0 }
}, { _id: false });

const PersonalDataSchema = new Schema({
  usuario: {
    type:    Schema.Types.ObjectId,
    ref:     'Usuario',
    required:true,
    unique: true
  },
  calidadSueno:   { type: [subRating],     default: [], validate: arr => Array.isArray(arr) },
  actitudInicial: { type: [subRating],     default: [], validate: arr => Array.isArray(arr) },
  actitudFinal:   { type: [subRating],     default: [], validate: arr => Array.isArray(arr) },
  diaCompletado:  { type: [subCompletion], default: [], validate: arr => Array.isArray(arr) },
  mantras:        { type: [subMantra],     default: [], validate: arr => Array.isArray(arr) },
  mantraFavorito: { type: String,          default: null },
  contadorRetosDia:       { type: Number,          default: 0 },
  contadorRetosSemana:    { type: Number,          default: 0 },
  contadorRetosMes:       { type: Number,          default: 0 },
  contadorRetosDestacados:{ type: Number,          default: 0 },
  rachaActual:    { type: Number,          default: 0 },
  rachaMaxima:    { type: Number,          default: 0 },
  cardsAleatorias: { type: [String], default: [] },

  usuarioCreado: { type: Date, default: Date.now },
  cambioSolicitado: { type: Boolean, default: false },
  cambioConfirmado: { type: Boolean, default: false },
  notificacionesActivadas: { type: Boolean, default: true },
  planActual: { type: String, default: 'inicial' },
  tutorialVisto: { type: Boolean, default: false },
  preguntasInicialesRespondidas:  { type: Boolean, default: false },
  cuadernoRojoComprado:  { type: Boolean, default: false },

  //Cuestionario Inicial
    // ——————— Cuestionario inicial ———————
    inicioDia: {
      type: Date,
      default: null,           // se guardará la hora de inicio del día
    },
    finJornada: {
      type: Date,
      default: null,           // hora de fin de la jornada
    },
    picoEnergia: {
      type: Date,
      default: null,           // hora del día con más energía
    },
    rutinaDiaria: {
      type: Boolean,
      default: false,          // ¿tiene rutina establecida?
    },
    actividadFisica: {
      type: Boolean,
      default: false,          // ¿practica deporte o actividad?
    },
    genero: {
      type: String,
      enum: ['Hombre', 'Mujer', 'Prefiero no decirlo'],
    },
    tiempoReflexion: {
      type: String,
      enum: ['15 mins', '30 mins', 'más de 1h'],
    },
    prefAprendizaje: {
      type: String,
      enum: ['Leyendo', 'Escuchando', 'Viendo vídeos'],
    },
    nivelDisciplina: {
      type: String,
      enum: ['Alta', 'Media', 'Baja'],
    },
    satisfaccionActual: {
      type: String,
      enum: ['Muy satisfecho', 'Algo satisfecho', 'Poco satisfecho'],
    },
    fechaCuestionarioInicial: {
      type: Date,
      default: null,           // momento en que respondió el formulario
    },
}, {
  timestamps: true
});

module.exports = model('PersonalData', PersonalDataSchema);
