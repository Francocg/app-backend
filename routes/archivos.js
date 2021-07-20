const { Router } = require('express');
const multer = require('multer');
const { subirArchivos, getArchivos, deleteArchivo, updateArchivo } = require('../controllers/archivosController');

const router = Router();

const storage = multer.memoryStorage({
    destination: function(callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('file');


router.post('/:idusuario', upload, subirArchivos);
router.get('/:idusuario', getArchivos);
router.put('/:idarchivo', upload, updateArchivo);
router.delete('/:idarchivo', deleteArchivo);


module.exports = router;