  
const {Router} = require('express')

const router = Router();

const {email, enviarCorreo} = require('../controllers/correoController')




router.post('/send', enviarCorreo);

module.exports=router;
