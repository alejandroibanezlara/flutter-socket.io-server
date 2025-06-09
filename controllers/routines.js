// controllers/routines.js
const mongoose = require('mongoose');
const Routine = require('../models/routine');
const { validarArea } = require('../helpers/areas');

// Crear nueva rutina
const crearRutina = async (req, res) => {
    try {
        const { body } = req;
        const userId = req.uid; // ID del usuario del JWT


        // Añadir metadata de creación
        body.metadata = {
            creadoPor: userId,
            ultimaModificacion: new Date()
        };

        const nuevaRutina = new Routine(body);
        await nuevaRutina.save();

        res.status(201).json({
            ok: true,
            rutina: nuevaRutina
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la rutina',
            errors: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
        });
    }
};

const obtenerRutinasPorEstado = async (req, res) => {
    try {
        const { status } = req.query;
        const userId = req.uid;

        if (!status) {
            return res.status(400).json({
                ok: false,
                msg: 'El parámetro "status" es obligatorio',
            });
        }

        const rutinas = await Routine.find({
            status,
            'metadata.creadoPor': userId
        });

        res.json({
            ok: true,
            status,
            rutinas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener rutinas por estado',
        });
    }
};

// Actualizar rutina
const actualizarRutina = async (req, res) => {
    try {
        const { routineId } = req.params;
        const { body } = req;
        const userId = req.uid;

        const { tipo, diasSemana, diasMes, semanasMes, fechaFin } = body
            body.reglasRepeticion = {
                tipo,
                diasSemana: Array.isArray(diasSemana) ? diasSemana : undefined,
                diasMes:    Array.isArray(diasMes)    ? diasMes    : undefined,
                semanasMes: Array.isArray(semanasMes)   ? semanasMes   : undefined,
                fechaFin:   fechaFin                  ? new Date(fechaFin) : undefined
            };

        if (!mongoose.Types.ObjectId.isValid(routineId)) {
            return res.status(400).json({
                ok: false,
                msg: 'ID de rutina inválido'
            });
        }

        // Añadir información de modificación
        body.metadata = body.metadata || {};
        body.metadata.ultimaModificacion = new Date();

        const rutina = await Routine.findOne({ _id: routineId, 'metadata.creadoPor': userId });
        if (!rutina) return res.status(404).json({ ok:false, msg:'No encontrada' });
        // Asignar todos los campos del body, incluida reglasRepeticion
        Object.assign(rutina, body);


        const rutinaActualizada = await rutina.save(); // dispara pre('save') → actualizarCacheDias()

        if (!rutinaActualizada) {
            return res.status(404).json({
                ok: false,
                msg: 'Rutina no encontrada o no tienes permisos'
            });
        }

        await rutinaActualizada.actualizarCacheDias();

        res.json({
            ok: true,
            rutina: rutinaActualizada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la rutina',
            errors: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
        });
    }
};

// Borrar rutina (borrado lógico)
const borrarRutina = async (req, res) => {
    try {
        const { routineId } = req.params;
        const userId = req.uid;

        if (!mongoose.Types.ObjectId.isValid(routineId)) {
            return res.status(400).json({
                ok: false,
                msg: 'ID de rutina inválido'
            });
        }

        // Borrado lógico (marcar como inactivo en lugar de eliminar)
        const rutina = await Routine.findOneAndUpdate(
            { _id: routineId, 'metadata.creadoPor': userId },
            { status: 'inactive' },
            { new: true }
        );

        if (!rutina) {
            return res.status(404).json({
                ok: false,
                msg: 'Rutina no encontrada o no tienes permisos'
            });
        }

        res.json({
            ok: true,
            msg: 'Rutina desactivada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al desactivar la rutina'
        });
    }
};

module.exports = {
    crearRutina,
    obtenerRutinasPorEstado,
    actualizarRutina,
    borrarRutina
};