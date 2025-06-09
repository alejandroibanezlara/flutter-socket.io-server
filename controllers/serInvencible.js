// controllers/serInvencible.js
const SerInvencibleData = require('../models/SerInvencibleData');
const Tool         = require('../models/Tool');
const MicroLearning = require('../models/Microlearning');
const { response } = require('express');

// Campos permitidos para actualización parcial
const allowedFields = ['mindset'];

// POST /api/serinvencible/ -> Crear o recuperar (upsert)
const createSerInvencibleData = async (req, res = response) => {
  const usuarioId = req.uid;
  if (!usuarioId) {
    return res.status(401).json({ success: false, message: 'Token no válido' });
  }
  try {
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: usuarioId },
      { $setOnInsert: { usuario: usuarioId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('createSerInvencibleData:', error);
    return res.status(500).json({ success: false, message: 'Error al crear o recuperar datos' });
  }
};

// GET /api/serinvencible/:idUsuario -> Obtener datos del usuario
const getSerInvencibleDataByUserId = async (req, res = response) => {
  const { idUsuario } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  
  
  try {
    const data = await SerInvencibleData.findOne({ usuario: idUsuario })
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'No hay datos para este usuario' });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('getSerInvencibleDataByUserId:', error);
    return res.status(500).json({ success: false, message: 'Error al leer datos' });
  }
};

// PATCH /api/serinvencible/:idUsuario -> Actualización parcial de mindset
const updateSerInvencibleDataByUserId = async (req, res = response) => {
  const { idUsuario } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  const body = req.body;
  const pushOps = {};
  const setOps  = {};

  Object.keys(body).forEach(key => {
    if (!allowedFields.includes(key)) return;
    const value = body[key];
    if (Array.isArray(value)) {
      pushOps[key] = { $each: value };
    } else {
      setOps[key] = value;
    }
  });

  if (!Object.keys(pushOps).length && !Object.keys(setOps).length) {
    return res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });
  }

  const update = {};
  if (Object.keys(setOps).length)  update.$set  = setOps;
  if (Object.keys(pushOps).length) update.$push = pushOps;

  try {
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: idUsuario },
      update,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('updateSerInvencibleDataByUserId:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar datos' });
  }
};

// DELETE /api/serinvencible/:idUsuario -> Eliminar datos del usuario
const deleteSerInvencibleDataByUserId = async (req, res = response) => {
  const { idUsuario } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  try {
    const data = await SerInvencibleData.findOneAndDelete({ usuario: idUsuario });
    if (!data) {
      return res.status(404).json({ success: false, message: 'No hay datos para eliminar' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('deleteSerInvencibleDataByUserId:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar datos' });
  }
};

// POST /api/serinvencible/:idUsuario/tools/:toolId -> Añadir tool
const addToolToUser = async (req, res = response) => {
  const { idUsuario, toolId } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  try {
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool no encontrada' });
    }
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: idUsuario },
      { $addToSet: { tools: toolId } },
      { new: true, runValidators: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('addToolToUser:', error);
    return res.status(500).json({ success: false, message: 'Error al añadir tool' });
  }
};

// DELETE /api/serinvencible/:idUsuario/tools/:toolId -> Quitar tool
const removeToolFromUser = async (req, res = response) => {
  const { idUsuario, toolId } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  try {
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: idUsuario },
      { $pull: { tools: toolId } },
      { new: true, runValidators: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('removeToolFromUser:', error);
    return res.status(500).json({ success: false, message: 'Error al quitar tool' });
  }
};

// POST /api/serinvencible/:idUsuario/library/:mlId -> Añadir microlearning
const addLibraryToUser = async (req, res = response) => {
  const { idUsuario, mlId } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  try {
    const ml = await MicroLearning.findById(mlId);
    if (!ml) {
      return res.status(404).json({ success: false, message: 'Microlearning no encontrado' });
    }
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: idUsuario },
      { $addToSet: { library: mlId } },
      { new: true, runValidators: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('addLibraryToUser:', error);
    return res.status(500).json({ success: false, message: 'Error al añadir microlearning' });
  }
};

// DELETE /api/serinvencible/:idUsuario/library/:mlId -> Quitar microlearning
const removeLibraryFromUser = async (req, res = response) => {
  const { idUsuario, mlId } = req.params;
  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  try {
    const data = await SerInvencibleData.findOneAndUpdate(
      { usuario: idUsuario },
      { $pull: { library: mlId } },
      { new: true, runValidators: true }
    )
    .populate('tools')
    .populate('library')
    .populate('usuario', 'nombre email');

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('removeLibraryFromUser:', error);
    return res.status(500).json({ success: false, message: 'Error al quitar microlearning' });
  }
};


// PATCH /api/serinvencible/:idUsuario/mindset/update
const updateMindsetEntry = async (req, res = response) => {
  const { idUsuario } = req.params;
  const { oldText, newText } = req.body;

  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }

  try {
    const result = await SerInvencibleData.updateOne(
      { usuario: idUsuario, 'mindset.texto': oldText },
      { $set: { 'mindset.$.texto': newText } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Frase no encontrada' });
    }

    return res.status(200).json({ success: true, message: 'Frase actualizada' });
  } catch (error) {
    console.error('updateMindsetEntry:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar frase' });
  }
};


// DELETE /api/serinvencible/:idUsuario/mindset
const removeMindsetEntry = async (req, res = response) => {
  const { idUsuario } = req.params;
  const { texto } = req.body;

  if (idUsuario !== req.uid) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }

  try {
    const result = await SerInvencibleData.updateOne(
      { usuario: idUsuario },
      { $pull: { mindset: { texto } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Frase no encontrada' });
    }

    return res.status(200).json({ success: true, message: 'Frase eliminada' });
  } catch (error) {
    console.error('removeMindsetEntry:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar frase' });
  }
};



module.exports = {
  createSerInvencibleData,
  getSerInvencibleDataByUserId,
  updateSerInvencibleDataByUserId,
  deleteSerInvencibleDataByUserId,
  addToolToUser,
  removeToolFromUser,
  addLibraryToUser,
  removeLibraryFromUser,
  updateMindsetEntry,
  removeMindsetEntry
};