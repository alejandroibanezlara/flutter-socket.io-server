/*

    path: api/personalData

*/
// routes/personalData.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  createOrGetPersonalData,
  getPersonalData,
  updatePersonalData,
  deletePersonalData,
  replaceMicrolearningCards,
  agregarCalidadSueno,
  agregarActitudInicial,
  agregarActitudFinal,
  agregarDiaCompletado,
  getPersonalDataLight,
} = require('../controllers/personalData');



const router = Router();

// Crear o recuperar (upsert)
router.post('/', validarJWT, createOrGetPersonalData);

// Obtener datos personales de un usuario
router.get('/:idUsuario', validarJWT, getPersonalData);

router.get('/:idUsuario/light', validarJWT, getPersonalDataLight);

// Actualizar parcialmente datos personales
router.patch('/:idUsuario', validarJWT, updatePersonalData);

// Eliminar datos personales de un usuario
router.delete('/:idUsuario', validarJWT, deletePersonalData);

//Cargar 3 nuevas Tarjetas
router.patch('/:idUsuario/replaceCards', validarJWT, replaceMicrolearningCards);

// Agregar nuevas entradas a los arrays acumulativos
router.patch('/:idUsuario/calidadSueno', validarJWT, agregarCalidadSueno);
router.patch('/:idUsuario/actitudInicial', validarJWT, agregarActitudInicial);
router.patch('/:idUsuario/actitudFinal', validarJWT, agregarActitudFinal);
router.patch('/:idUsuario/diaCompletado', validarJWT, agregarDiaCompletado);

module.exports = router;
