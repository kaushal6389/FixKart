const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const expertRoutes = require('./routes/experts');
const requestRoutes = require('./routes/requests');
const hireRoutes = require('./routes/hires');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static frontend files from project root
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/hires', hireRoutes);

app.listen(PORT, () => {
  console.log(`FixKart server running on http://localhost:${PORT}`);
});
