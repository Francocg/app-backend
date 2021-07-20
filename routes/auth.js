const { Router } = require('express');
const { login, createUser, getUsuarios, validarToken } = require('../controllers/authControllers');
const { validarJWT } = require('../helpers/jwt');

const router = Router();

router.post('/sign-in', login)
router.post('/sign-up',createUser)

router.get('/get-users',  getUsuarios)
router.get('/validar',  validarJWT, validarToken)

module.exports = router;