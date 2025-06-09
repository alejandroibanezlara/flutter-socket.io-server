
const { Schema, model } = require('mongoose');

// Sub-schema para cada tarea individual
const TaskSchema = new Schema({
    title: {       // Título de la tarea
      type: String,
      required: true
    },
    status: {      // Estado de la tarea (e.g. 'pending', 'in-progress', 'done')
      type: String,
      enum: ['pending', 'in-progress', 'done', 'frog'],
      default: 'pending'
    },
    createdAt: {   // Fecha de creación de la tarea
      type: Date,
      default: Date.now
    },
    completedAt: { // Fecha de finalización (si se marca como done)
      type: Date
    },
    frog: { // Fecha de finalización (si se marca como done)
      type: Boolean
    }
  }, {
    _id: false     // No generar un ID separado para cada subdocumento
  });

const DailyTaksSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
      },
    fecha: {
        type: Date,
        required: true,
    },
    tasks: {      // Array de tareas embebidas
        type: [TaskSchema],
        validate: {
          validator: arr => arr.length <= 5,
          message: 'No puede haber más de 5 tareas diarias'
        }
      }
}, {
    timestamps: true
}
);



DailyTaksSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('DailyTask', DailyTaksSchema);