// routes/serInvencible.routes.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
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
} = require('../controllers/serInvencible');

const router = Router();

// Crear o recuperar (upsert)
router.post('/', validarJWT, createSerInvencibleData);

// Obtener datos del usuario
router.get('/:idUsuario', validarJWT, getSerInvencibleDataByUserId);

// Actualizar parcialmente
router.patch('/:idUsuario', validarJWT, updateSerInvencibleDataByUserId);

// Eliminar datos del usuario
router.delete('/:idUsuario', validarJWT, deleteSerInvencibleDataByUserId);

// Añadir una tool al usuario
router.post('/:idUsuario/tools/:toolId', validarJWT, addToolToUser);

// Quitar una tool del usuario
router.delete('/:idUsuario/tools/:toolId', validarJWT, removeToolFromUser);

// Añadir una tarjeta de microlearning al usuario
router.post('/:idUsuario/library/:mlId', validarJWT, addLibraryToUser);

// Quitar una tarjeta de microlearning del usuario
router.delete('/:idUsuario/library/:mlId', validarJWT, removeLibraryFromUser);

// Actualizar una frase del mindset
router.patch('/:idUsuario/mindset/update', validarJWT, updateMindsetEntry);

// Eliminar una frase del mindset
router.delete('/:idUsuario/mindset', validarJWT, removeMindsetEntry);

module.exports = router;
