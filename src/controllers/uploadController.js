exports.uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }
    const port = process.env.PORT || 5000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const videoUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ 
        message: 'Upload successful', 
        filename: req.file.filename,
        url: videoUrl
    });
}
