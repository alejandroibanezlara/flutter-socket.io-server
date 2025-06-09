const { Schema, model } = require('mongoose');
const SerInvencibleDataSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  tools:   [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
  mindset: [{ 
    texto:   String, 
    status:  { type: String, enum: ['activo','inactivo'], default: 'activo' }, 
    contador:{ type: Number, default: 0 }, 
    fecha:   { type: Date, default: Date.now } 
  }],
  library: [{ type: Schema.Types.ObjectId, ref: 'Microlearning' }]
}, { timestamps: true });
module.exports = model('SerInvencibleData', SerInvencibleDataSchema);