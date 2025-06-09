const { Schema, model, Types  } = require('mongoose');

const AreaInvencibleSchema = new Schema({
    titulo: { type: String, required: true },
    icono:  { type: String, required: true }
  }, { _id: false });

// 1. Challenge
const ChallengeSchema = new Schema({
    type:                 { type: String, required: true },
    title:                { type: String, required: true },
    shortText:            { type: String, required: true },
    description:          { type: String },
    icon:                 { type: String },
    areasSerInvencible:   { type: [AreaInvencibleSchema] },
    timePeriod:           { type: String, required: true },
    frequency:            { type: String, required: true },
    points:               { type: Number, default: 0 },
    notebook:             { type: Boolean, required: true },
    status:               {
                            type: String,
                            enum: ['pending check','active','inactive'],
                            default: 'pending check'
                          },
    images:               [{ type: String }],
    config:               { type: Schema.Types.Mixed },
    prerequisiteChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    prerequisiteCount:    { type: Number, default: 0 }
  }, { timestamps: true });

    
  // 2. UserChallenge  
  const ProgressHistorySchema = new Schema({
    date:    { type: Date, required: true },           // Fecha de la actualización
    value:   { type: Schema.Types.Mixed, required: true } // Valor registrado (puede ser número, texto, objeto…)
  }, { _id: false });

  // Schema para ítems de checklist
  const ChecklistItemSchema = new Schema({
    check:    { type: String,  required: true },
    complete: { type: Boolean, default: false }
  }, { _id: false });

  // Schema principal de UserChallenge
  const UserChallengeSchema = new Schema({
    userId:           { type: Types.ObjectId, ref: 'User',      required: true },
    challengeId:      { type: Types.ObjectId, ref: 'Challenge', required: true },
    status:           { type: String, enum: ['active','completed','cancelled', 'incomplete'], default: 'active' },
    startDate:        { type: Date, default: Date.now },
    endDate:          { type: Date },
    isActive:         { type: Boolean, default: true },
    currentTotal:     { type: Number,  default: 0 },
    streakDays:       { type: Number,  default: 0 },

    // Propiedades nuevas
    counter:          { type: Number},     // Contador adicional
    writing:          { type: String},    // Texto libre del usuario
    checklist:        { type: [ChecklistItemSchema], default: [] },

    progressData:     { type: Schema.Types.Mixed, default: {} },
    progressHistory:  { type: [ProgressHistorySchema], default: [] },
    lastUpdated:      { type: Date, default: Date.now }
  }, {
    timestamps: true
  });



const Challenge     = model('Challenge', ChallengeSchema);
const UserChallenge = model('UserChallenge', UserChallengeSchema);
module.exports = { Challenge, UserChallenge  };
// module.exports = model('UserChallengeMetrics', UserChallengeMetricsSchema);