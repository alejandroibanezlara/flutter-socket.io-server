/*

    path: api/objectives

*/
// routes/personalData.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  createObjectives,
  getObjectives,
  updateObjectives,
  deleteObjectives
} = require('../controllers/objectives');

const router = Router();

// Crear o recuperar (upsert)
router.post('/', validarJWT, createObjectives);

// Obtener datos personales de un usuario
router.get('/:idUsuario', validarJWT, getObjectives);

// Actualizar parcialmente datos personales
router.patch('/:idObjectives', validarJWT, updateObjectives);

// Eliminar datos personales de un usuario
router.delete('/:idObjective/:idUsuario', validarJWT, deleteObjectives);

module.exports = router;
