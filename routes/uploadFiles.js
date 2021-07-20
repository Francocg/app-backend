const { Router } = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadFiles');

const router = Router();

const storage = multer.memoryStorage({
    destination: function(callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('file');


router.post('/', upload, uploadFile);

module.exports = router;