const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const transcriptionController = require('../controllers/transcriptionController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', (req, res) => {
    res.send('Simora Backend is running');
});

router.post('/upload', upload.single('video'), uploadController.uploadVideo);
router.post('/transcribe', transcriptionController.transcribeVideo);

module.exports = router;
