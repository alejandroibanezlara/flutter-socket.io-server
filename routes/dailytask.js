/*

    path: api/dailytask

*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearTareas, obtenerTareasPorFecha, actualizarTareas } = require('../controllers/dailytask');

const router = Router();

router.get('/:fecha',validarJWT, obtenerTareasPorFecha)
router.post('/',validarJWT, crearTareas)
router.put('/:taskId', validarJWT, actualizarTareas)

module.exports = router;