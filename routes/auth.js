/*

    path: api/login

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken, googleAuth } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio').not().isEmpty(),
        validarCampos,
    ],crearUsuario)

router.post('/', [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio').not().isEmpty(),
    ],loginUsuario)


router.post('/google', googleAuth);

router.get('/renew',validarJWT, renewToken)

module.exports = router;