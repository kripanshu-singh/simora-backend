const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { transcribeVideo } = require('./utils/transcription');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');

// Multer setup for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.send('Simora Backend is running');
});

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }
    const videoUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ 
        message: 'Upload successful', 
        filename: req.file.filename,
        url: videoUrl
    });
});

app.post('/transcribe', async (req, res) => {
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
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
