// controllers/challenges.js
const mongoose = require('mongoose');
// const Challenge = require('../models/challenge');
const { Challenge } = require('../models/challenge');

// Crear nuevo reto
const crearChallenge = async (req, res) => {
  try {
    const { body } = req;
    // const userId = req.uid; // ID del usuario del JWT

    // Añadir metadata de creación y última modificación
    body.metadata = {
    //   creadoPor: userId,
      ultimaModificacion: new Date()
    };

    const nuevoChallenge = new Challenge(body);
    await nuevoChallenge.save();

    res.status(201).json({
      ok: true,
      reto: nuevoChallenge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear el reto',
      errors: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
    });
  }
};

// Obtener lista de retos (opciones de filtro pueden añadirse)
// const obtenerChallenges = async (req, res) => {
//   try {
//     const retos = await Challenge.find();
//     res.json({
//       ok: true,
//       retos
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       ok: false,
//       msg: 'Error al obtener retos'
//     });
//   }
// };

const obtenerChallenges = async (req, res) => {
    try {
      // 1. Leemos los filtros de la query
      const { timePeriod, status } = req.query;
  
      // 2. Preparamos el objeto de consulta Mongoose
      const filtro = {};
      if (timePeriod) filtro.timePeriod = timePeriod;
      if (status)     filtro.status     = status;
  
      // 3. Ejecutamos la búsqueda con filtro
      const retos = await Challenge.find(filtro);
  
      // 4. Devolvemos respuesta
      return res.json({
        ok: true,
        retos
      });
    } catch (err) {
      console.error('Error al obtener retos:', err);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno al listar retos'
      });
    }
  };
  

// Obtener detalle de un reto
const obtenerChallengePorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: 'ID de reto inválido' });
    }
    const reto = await Challenge.findById(id);
    if (!reto) {
      return res.status(404).json({ ok: false, msg: 'Reto no encontrado' });
    }
    res.json({ ok: true, reto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el reto' });
  }
};

// Actualizar reto
const actualizarChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const userId = req.uid;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: 'ID de reto inválido' });
    }

    // Añadir metadata de modificación
    body.metadata = body.metadata || {};
    body.metadata.ultimaModificacion = new Date();

    const reto = await Challenge.findById(id);
    if (!reto) {
      return res.status(404).json({ ok: false, msg: 'Reto no encontrado' });
    }

    Object.assign(reto, body);
    const retoActualizado = await reto.save();

    res.json({
      ok: true,
      reto: retoActualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar el reto',
      errors: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
    });
  }
};

// Borrar reto (borrado lógico cambiando status a 'inactive')
const borrarChallenge = async (req, res) => {

    try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: 'ID de reto inválido' });
    }

    const reto = await Challenge.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );
    if (!reto) {
      return res.status(404).json({ ok: false, msg: 'Reto no encontrado' });
    }
    res.json({ ok: true, msg: 'Reto desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al desactivar el reto' });
  }
};



const obtenerChallengesMaintenance = async (req, res) => {
    try {


      // 3. Ejecutamos la búsqueda con filtro
      const retos = await Challenge.find().lean();
  
      // 4. Devolvemos respuesta
      return res.json({
        ok: true,
        retos
      });
    } catch (err) {
      console.error('Error al obtener retos:', err);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno al listar retos'
      });
    }
  };
  


module.exports = {
  crearChallenge,
  obtenerChallenges,
  obtenerChallengePorId,
  actualizarChallenge,
  borrarChallenge,
  obtenerChallengesMaintenance
};