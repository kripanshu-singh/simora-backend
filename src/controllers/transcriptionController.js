const path = require('path');
const fs = require('fs');
const { transcribeVideo } = require('../services/transcriptionService');

const uploadDir = path.join(__dirname, '../../uploads');

exports.transcribeVideo = async (req, res) => {
    const { filename } = req.body;
    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const captions = await transcribeVideo(filePath);
        res.json({ captions });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Failed to transcribe video', details: error.message });
    }
};
