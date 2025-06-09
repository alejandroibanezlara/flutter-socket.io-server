/*

    path: api/user_challenge

*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { createUserChallenge,  getUserChallenges, getUserChallenge, updateUserChallenge, finishToday, deleteUserChallenge } = require('../controllers/user_challenge');

const router = Router();

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