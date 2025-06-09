// models/Tool.js
const { Schema, model } = require('mongoose');
const ToolSchema = new Schema({
  title:  { type: String, required: true },
  icon:   { type: String, required: true },
  route:  { type: String, required: true },
  fecha:  { type: Date,   default: Date.now }
}, { timestamps: true });
module.exports = model('Tool', ToolSchema);