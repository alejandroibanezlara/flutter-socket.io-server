const { Schema, model } = require('mongoose');
const { calcularDiasFuturos } = require('../helpers/calcularDiasFuturos'); // Extrae la función si es necesario


const RoutineSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    tiempoYlugar: {
        type: String,
        required: [true, 'El tiempo y lugar es obligatorio'],
        trim: true
    },
    tipoPersona: {
        type: String,
        required: [true, 'El tipo de persona es obligatorio'],
        trim: true
    },
    declaracionCompleta: {
        type: String,
        required: [true, 'La declaración completa es obligatoria'],
        trim: true
    },
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    areas: {
        type: [{
          titulo: {
            type: String,
            enum: [
              'Empatía y Solidaridad',
              'Carisma',
              'Disciplina',
              'Organización', 
              'Adaptabilidad',
              'Imagen pulida',
              'Visión estratégica',
              'Educación financiera',
              'Actitud de superación',
              'Comunicación asertiva'
            ],
            required: true
          },
          icono: {
            type: String,
            required: true
          }
        }],
        validate: {
          validator: function(arr) {
            return arr.length > 0;
          },
          message: 'Debe seleccionar al menos un área'
        }
      },
      icono: {
        type: String,
        trim: true
      },
    tipo: {
        type: String,
        enum: {
            values: ['semanal', 'mensual', 'personalizada'],
            message: '{VALUE} no es un tipo válido'
        },
        required: [true, 'El tipo de rutina es obligatorio']
    },
    diasSemana: {
        type: [Number],
        min: [1, 'Debe estar entre 1 y 7'],
        max: [7, 'Debe estar entre 1 y 7'],
        required: false
      },
      diasMes: {
        type: [Number],
        required: false
      },
      semanasMes: {
        type: [Number],
        required: false
      },
      horario: {
        type: {
          horaInicio: String,
          duracionMinutos: Number
        },
        required: false
      },
    // Reemplaza diasFuturos por estos nuevos campos:
    reglasRepeticion: {
        tipo: { 
            type: String,
            enum: ['semanal', 'mensual', 'personalizada'],
            required: false
        },
        diasSemana: { type: [Number], default: undefined }, // [1,5] para Lunes y Viernes
        diasMes: { type: [Number], default: undefined },    // [15] para día 15 de cada mes
        semanasMes:  { type: [Number], default: undefined }, // [1,3,5]
        fechaFin: { type: Date } // Opcional: fecha límite de repetición
    },
    cacheDias: {
        proximosDias: { type: [Date], default: [] }, // Próximos 14 días cacheados
        ultimaActualizacion: { type: Date }
    },
    status: {
        type: String,
        enum: {
            values: ['in-progress', 'done', 'inactive'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'in-progress'
    },
    configNotificacion: {
        type: new Schema({
          activada: {
            type: Boolean,
            default: true
          },
          minutosAntes: {
            type: Number,
            enum: [0, 5, 10, 15, 20, 25, 30],
            default: 0
          },
          horaExacta: {
            type: String,
            match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'],
            required: false
          }
        }, { _id: false })
      },
    diasCompletados: [
        {
            fecha: {
                type: Date,
                required: true,
                index: true
            },
            status: {
                type: String,
                enum: ['completado', 'pendiente', 'omitido', 'parcial'],
                default: 'pendiente'
            },
            detalles: {
                horaCompletado: Date,
                comentarios: String
            }
        }
    ],
    metadata: {
        creadoPor: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        ultimaModificacion: Date
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    }
});

// Validación de reglas
RoutineSchema.pre('validate', function(next) {
    if (this.reglasRepeticion.tipo === 'semanal' && !this.reglasRepeticion.diasSemana?.length) {
        this.invalidate('reglasRepeticion.diasSemana', 'Se requieren días para rutinas semanales');
    }
    if (this.reglasRepeticion.tipo === 'mensual' && !this.reglasRepeticion.diasMes?.length) {
        this.invalidate('reglasRepeticion.diasMes', 'Se requieren días para rutinas mensuales');
    }
    if (this.reglasRepeticion.tipo === 'personalizada') {
        if (!this.reglasRepeticion.diasSemana?.length) {
        this.invalidate('reglasRepeticion.diasSemana', 'Se requieren días de la semana para rutinas personalizadas');
        }
        if (!this.reglasRepeticion.semanasMes?.length) {
        this.invalidate('reglasRepeticion.semanasMes', 'Se requieren semanas del mes para rutinas personalizadas');
        }
    }
    next();
});

// Actualización del caché al guardar
RoutineSchema.pre('save', async function() {
    if (this.isNew || this.isModified('reglasRepeticion')) {
        await this.actualizarCacheDias();
    }
});

// Método para actualizar el caché de días
RoutineSchema.methods.actualizarCacheDias = async function(cantidadDias = 14) {
    const proximos = this.calcularDiasFuturos(cantidadDias);
    const ahora = new Date();
    await this.constructor.updateOne(
      { _id: this._id },
      {
        $set: {
          'cacheDias.proximosDias': proximos,
          'cacheDias.ultimaActualizacion': ahora
        }
      }
    );
    // Opcional: sincronizar la instancia en memoria
    this.cacheDias.proximosDias = proximos;
    this.cacheDias.ultimaActualizacion = ahora;
    return this;
  };


  RoutineSchema.methods.calcularDiasFuturos = function(cantidadDias = 14) {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const resultados = [];
    let diasRevisados = 0;
  
    while (resultados.length < cantidadDias && diasRevisados < 365*3) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + diasRevisados);
  
      // JS getDay() 0–6 → ISO 1–7
      const diaJS   = fecha.getDay();
      const diaISO  = diaJS === 0 ? 7 : diaJS;
      const diaMes  = fecha.getDate();
      const semanaMes = Math.ceil(diaMes / 7);
  
      const r = this.reglasRepeticion;
  
      if (r.tipo === 'semanal') {
        if (r.diasSemana?.includes(diaISO)) {
          resultados.push(fecha);
        }
      }
      else if (r.tipo === 'mensual') {
        if (r.diasMes?.includes(diaMes)) {
          resultados.push(fecha);
        }
      }
      else if (r.tipo === 'personalizada') {
        // AÑADIDO: sólo incluyo si ES uno de los días y ES una de las semanas
        if (
          r.diasSemana?.includes(diaISO) &&
          r.semanasMes?.includes(semanaMes)
        ) {
          resultados.push(fecha);
        }
      }
  
      if (r.fechaFin && fecha > r.fechaFin) break;
  
      diasRevisados++;
    }
  
    return resultados.slice(0, cantidadDias);
  };

RoutineSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
      await doc.actualizarCacheDias();
    }
  });

RoutineSchema.index({ status: 1 });
RoutineSchema.index({ tipo: 1 });
RoutineSchema.index({ 'diasCompletados.fecha': 1 });
RoutineSchema.index({ 'metadata.creadoPor': 1 });
RoutineSchema.index({ 'diasFuturos': 1 }); // Nuevo índice para búsquedas por días futuros

module.exports = model('Routine', RoutineSchema);