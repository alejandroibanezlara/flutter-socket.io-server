// controllers/dailytask.js
const mongoose = require('mongoose');
const DailyTask = require('../models/dailytask');

// Crear o actualizar tareas diarias según existencia previa
const crearTareas = async (req, res) => {
  try {
    // 1. Validación de entrada
    const { fecha, tasks } = req.body;
    if (!fecha || !Array.isArray(tasks) || tasks.length < 1) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan parámetros: fecha y al menos una tarea"
      });
    }
    if (tasks.length > 5) {
      return res.status(400).json({
        ok: false,
        msg: "No puede haber más de 5 tareas diarias"
      });
    }
    // Validar que cada tarea tenga título
    for (const task of tasks) {
      if (!task.title) {
        return res.status(400).json({
          ok: false,
          msg: "Cada tarea debe incluir al menos el campo 'title'"
        });
      }
    }

    // 2. Normalizar fecha
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj)) {
      return res.status(400).json({
        ok: false,
        msg: "Formato de fecha inválido. Usa YYYY-MM-DD"
      });
    }

    // 3. Buscar si ya existe
    const usuarioId = mongoose.Types.ObjectId(req.uid);
    let registro = await DailyTask.findOne({
      usuario: usuarioId,
      fecha:   fechaObj
    });

    if (registro) {
      // 4a. Actualizar array de tasks
      registro.tasks = tasks;
      const tareaActualizada = await registro.save();

    //   console.log(res.status(201).json({ ok: true, tarea: tareaActualizada }));
      return res.status(201).json({ ok: true, tarea: tareaActualizada });
    }

    // 4b. Crear nuevo registro
    const nuevaTarea = new DailyTask({
      usuario: usuarioId,
      fecha:   fechaObj,
      tasks
    });
    const tareaGuardada = await nuevaTarea.save();
    return res.status(201).json({ ok: true, tarea: tareaGuardada });

  } catch (error) {
    console.error("Error al crear o actualizar tarea diaria:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno al procesar la tarea diaria"
    });
  }
};

// Obtener tareas por fecha (parámetro ruta)
const obtenerTareasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    // Validar formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ ok: false, msg: "Formato de fecha inválido. Usa YYYY-MM-DD" });
    }
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const tareas = await DailyTask.find({
      usuario: mongoose.Types.ObjectId(req.uid),
      fecha:   { $gte: inicio, $lte: fin }
    }).lean();

    return res.json({ ok: true, tareas });
  } catch (error) {
    console.error("Error al obtener tareas por fecha:", error);
    return res.status(500).json({ ok: false, msg: "Error interno al obtener las tareas" });
  }
};


// Actualizar una tarea específica dentro del array de tasks
// Actualizar tareas diarias (documento completo)
const actualizarTareas = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { fecha, tasks } = req.body;
  
      // Validación básica
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ 
          ok: false, 
          msg: "ID de tarea diaria no válido" 
        });
      }
  
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ 
          ok: false, 
          msg: "El campo 'tasks' es requerido y debe ser un array" 
        });
      }
  
      // Buscar y actualizar
      const usuarioId = mongoose.Types.ObjectId(req.uid);
      const dailyTask = await DailyTask.findOneAndUpdate(
        { 
          _id: taskId,
          usuario: usuarioId 
        },
        { 
          fecha: fecha ? new Date(fecha) : undefined,
          tasks 
        },
        { 
          new: true, // Devuelve el documento actualizado
          runValidators: true // Aplica las validaciones del schema
        }
      );
  
      if (!dailyTask) {
        return res.status(404).json({ 
          ok: false, 
          msg: "Tarea diaria no encontrada o no pertenece al usuario" 
        });
      }
  
      return res.json({ 
        ok: true, 
        tarea: dailyTask 
      });
  
    } catch (error) {
      console.error("Error al actualizar tareas:", error);
      return res.status(500).json({ 
        ok: false, 
        msg: error.message || "Error interno al actualizar las tareas" 
      });
    }
  };

module.exports = {
  crearTareas,
  obtenerTareasPorFecha,
  actualizarTareas
};
