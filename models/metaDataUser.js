const { Schema, model } = require('mongoose');

const MetaDataUserSchema = new Schema({
  usuario: {
    type:    Schema.Types.ObjectId,
    ref:     'Usuario',
    required:true,
    unique:  true
  },

  // ——— Arrays de fechas ——— CUESTIONARIO FINAL DIA
  retosDiariosCompletados:   { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  //retosDiariosEnCurso:        { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosDiariosNoCompletados:  { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosDiariosCancelados:     { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  retosExtraDiariosCompletados:  { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  //retosExtraDiariosEnCurso:       { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosExtraDiariosNoCompletados: { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosExtraDiariosCancelados:    { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  retosSemanalesCompletados:   { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  //retosSemanalesEnCurso:       { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosSemanalesNoCompletados: { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosSemanalesCancelados:    { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  retosMensualesCompletados:   { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  //retosMensualesEnCurso:       { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosMensualesNoCompletados: { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosMensualesCancelados:    { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  retosDestacadosCompletados:   { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  //retosDestacadosEnCurso:       { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosDestacadosNoCompletados: { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  retosDestacadosCancelados:    { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  diaTareasCompleto:         { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  diaTareasNoCompleto:         { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  diasRutinasCompletadas:    { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  diasRutinasNoCompletadas:  { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  cuestionarioInicialCompletado: { type: [Date], default: [], validate: arr => Array.isArray(arr) },
  cuestionarioFinalCompletado:   { type: [Date], default: [], validate: arr => Array.isArray(arr) },

  perfectDay: { type: [Date], default: [], validate: arr => Array.isArray(arr) }, // perfectday = retos diarios = 3; tareas pendientes = 0; rutinas no completadas = 0
  lastActivityDate: { type: Date, default: null },

  // ——— Contadores Generales (int) ——— CUESTIONARIO FINAL DIA // PENDIENTE AUN
  tareasCompletadas:      { type: Number, default: 0 },
  tareasNoCompletadas:    { type: Number, default: 0 },
  tareasSapoCompletadas:  { type: Number, default: 0 },
  microlearningsLeidos:   { type: Number, default: 0 },
  cumplimientoGeneral:    { type: Number, default: 0 },
  
  
  
  // ——— Contadores Retos (int) ——— RETO
  retosEmpatiaYSolidaridad:    { type: Number, default: 0 },
  retosCarisma:                { type: Number, default: 0 },
  retosDisciplina:             { type: Number, default: 0 },
  retosOrganizacion:           { type: Number, default: 0 },
  retosAdaptabilidad:          { type: Number, default: 0 },
  retosImagenPulida:           { type: Number, default: 0 },
  retosVisionEstrategica:      { type: Number, default: 0 },
  retosEducacionFinanciera:    { type: Number, default: 0 },
  retosActitudDeSuperacion:    { type: Number, default: 0 },
  retosComunicacionAsertiva:   { type: Number, default: 0 },

  puntosEmpatiaYSolidaridad:    { type: Number, default: 0 },
  puntosCarisma:                { type: Number, default: 0 },
  puntosDisciplina:             { type: Number, default: 0 },
  puntosOrganizacion:           { type: Number, default: 0 },
  puntosAdaptabilidad:          { type: Number, default: 0 },
  puntosImagenPulida:           { type: Number, default: 0 },
  puntosVisionEstrategica:      { type: Number, default: 0 },
  puntosEducacionFinanciera:    { type: Number, default: 0 },
  puntosActitudDeSuperacion:    { type: Number, default: 0 },
  puntosComunicacionAsertiva:   { type: Number, default: 0 },

  retosCounter:         { type: Number, default: 0 },
  retosInverseCounter:  { type: Number, default: 0 },
  retosChecklist:       { type: Number, default: 0 },
  retosQuestionnaire:   { type: Number, default: 0 },
  retosWriting:         { type: Number, default: 0 },
  retosRedNote:         { type: Number, default: 0 },
  retosCrono:           { type: Number, default: 0 },
  retosTempo:           { type: Number, default: 0 },
  retosMath:            { type: Number, default: 0 },
  retosSingle:          { type: Number, default: 0 },

  // ——— Tiempos medios (double) ——— RETO
  tiempoMedioCounter:         { type: Number, default: 0.0 },
  tiempoMedioInverseCounter:  { type: Number, default: 0.0 },
  tiempoMedioChecklist:       { type: Number, default: 0.0 },
  tiempoMedioQuestionnaire:   { type: Number, default: 0.0 },
  tiempoMedioWriting:         { type: Number, default: 0.0 },
  tiempoMedioRedNote:         { type: Number, default: 0.0 },
  tiempoMedioCrono:           { type: Number, default: 0.0 },
  tiempoMedioTempo:           { type: Number, default: 0.0 },
  tiempoMedioMath:            { type: Number, default: 0.0 },
  tiempoMedioSingle:          { type: Number, default: 0.0 },

  // ——— Rachas ——— CUESTIONARIO FINAL DIA
  rachaTareas:          { type: Number, default: 0 },
  rachaMaximaTareas:    { type: Number, default: 0 },
  rachaRutinas:         { type: Number, default: 0 },
  rachaMaximaRutinas:   { type: Number, default: 0 },
  rachaRetosDiarios:    { type: Number, default: 0 },
  rachaMaximaRetosDiarios:{ type: Number, default: 0 },


  // ——— Métricas agregadas ——— CUESTIONARIO FINAL DIA
  averageDailyPoints:      { type: Number, default: 0 },
  averageCompletionTime:   { type: Number, default: 0.0 }
}, {
  timestamps: true
});

module.exports = model('MetaDataUser', MetaDataUserSchema);