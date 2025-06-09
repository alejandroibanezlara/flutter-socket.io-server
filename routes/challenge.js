/*

    path: api/challenge
    path: api/user-challenge
    path: api/user-challenge-data

*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearChallenge, obtenerChallenges, obtenerChallengePorId, actualizarChallenge, borrarChallenge, obtenerChallengesMaintenance } = require('../controllers/challenge');
const { createUserChallenge,  getUserChallenges, getUserChallenge, updateUserChallenge, finishToday, deleteUserChallenge } = require('../controllers/user_challenge');

const router = Router();

// router.post('/', validarJWT,  crearChallenge);
// router.get('/', validarJWT,  obtenerChallenges);
// router.get('/:id', validarJWT,  obtenerChallengePorId);
// router.put('/:id',validarJWT,   actualizarChallenge);
// router.delete('/:id',validarJWT,   borrarChallenge);

router.post('/',   crearChallenge);
router.get('/',   obtenerChallenges);
router.get('/maintenance', obtenerChallengesMaintenance);
router.get('/:id',   obtenerChallengePorId);
router.put('/:id',   actualizarChallenge);
router.delete('/:id',   borrarChallenge);

// router.post('/user-challenges', validarJWT, userChallengeController.assign);
// router.get('/user-challenges/:userId', validarJWT, userChallengeController.list);

// router.post('/entries', validarJWT, entryController.addEntry);
// router.get('/entries/:ucId', validarJWT, entryController.list);




//WEB MANTENIMIENTO


// USER CHALLENGE
// POST   /api/user-challenges           → createUserChallenge
router.post('/',validarJWT,  createUserChallenge);

// GET    /api/user-challenges           → getUserChallenges
router.get('/',validarJWT,  getUserChallenges);

// GET    /api/user-challenges/:id       → getUserChallenge
router.get('/:id',validarJWT, getUserChallenge);

// PUT    /api/user-challenges/:id       → updateUserChallenge
router.put('/:id',validarJWT, updateUserChallenge);

// PATCH  /api/user-challenges/:id/finish → finishToday
router.patch('/:id/finish',validarJWT, finishToday);

// DELETE /api/user-challenges/:id       → deleteUserChallenge
router.delete('/:id',validarJWT,  deleteUserChallenge);

module.exports = router;