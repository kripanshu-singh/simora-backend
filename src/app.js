const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', apiRoutes);

// Serve uploaded files statically
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

module.exports = app;
