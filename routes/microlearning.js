/*

    path: api/microlearning

*/



const express = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = express.Router();
const { getRandomMicrolearnings, getAll, create, update, eliminar } = require('../controllers/microlearning');


router.get('/aleatorios',validarJWT, getRandomMicrolearnings);



// NUEVAS RUTAS CRUD
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', eliminar);

module.exports = router;