// controllers/objectives.js

const ObjetivoPersonal = require('../models/Objective');

/**
 * Crea o actualiza (upsert) el objetivo personal del usuario autenticado.
 * - Extrae el ID de usuario de req.uid (establecido por validarJWT).
 * - Si no existe, lo crea; si existe, actualiza los campos principales.
 */
const createObjectives = async (req, res) => {
    try {
      const {
        titulo,
        descripcion,
        beneficios,
        fechaCreacion,        // opcional: si lo envías
        fechaObjetivo,
        areaSerInvencible,
        tipo
      } = req.body;
      const usuario = req.uid;
  
      // 1. Construye un nuevo objeto con los datos recibidos
      const newObjective = new ObjetivoPersonal({
        usuario,
        titulo,
        descripcion,
        beneficios,
        tipo,
        // Si no envías fechaCreacion, Mongo la rellenará con Date.now()
        fechaCreacion: fechaCreacion ? new Date(fechaCreacion) : undefined,
        fechaObjetivo: new Date(fechaObjetivo),
        areaSerInvencible
      });
  
      // 2. Guárdalo en la base de datos
      await newObjective.save();
  
      // 3. Devuelve respuesta con el documento creado
      return res.status(201).json({
        ok: true,
        objective: newObjective
      });
    } catch (error) {
      console.error('Error en createObjectives:', error);
      return res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
      });
    }
  };

/**
 * Recupera el objetivo personal de un usuario.
 * - Parámetro URL: idUsuario
 */
const getObjectives = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const objective = await ObjetivoPersonal.find({ usuario: idUsuario });

    if (!objective) {
      return res.status(404).json({
        ok: false,
        msg: 'Objetivo no encontrado'
      });
    }


    return res.json({
      ok: true,
      objective
    });
  } catch (error) {
    console.error('Error en getObjectives:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
};

/**
 * Actualiza parcialmente un objetivo existente.
 * - Parámetro URL: idObjectives (ID del documento ObjetivoPersonal).
 * - Cuerpo: campos a modificar.
 */
const updateObjectives = async (req, res) => {
  try {
    const { idObjectives } = req.params;
    const updates = req.body;

    const objective = await ObjetivoPersonal.findByIdAndUpdate(
      idObjectives,
      updates,
      { new: true }
    );

    if (!objective) {
      return res.status(404).json({
        ok: false,
        msg: 'Objetivo no encontrado'
      });
    }

    return res.json({
      ok: true,
      objective
    });
  } catch (error) {
    console.error('Error en updateObjectives:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
};

/**
 * Elimina el objetivo personal de un usuario.
 * - Parámetro URL: idUsuario
 */
const deleteObjectives = async (req, res) => {
  try {
    const { idObjective, idUsuario } = req.params;
    console.log(idObjective);
    console.log(idUsuario);
    const objective = await ObjetivoPersonal.findOneAndDelete(
        { _id: idObjective, 'usuario': idUsuario },
    );

    if (!objective) {
      return res.status(404).json({
        ok: false,
        msg: 'Objetivo no encontrado'
      });
    }

    return res.json({
      ok: true,
      msg: 'Objetivo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteObjectives:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
};

module.exports = {
  createObjectives,
  getObjectives,
  updateObjectives,
  deleteObjectives
};