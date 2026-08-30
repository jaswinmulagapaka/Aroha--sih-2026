const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const careerRoutes = require('./routes/careerRoutes');
const userRoutes = require('./routes/userRoutes');
const questRoutes = require('./routes/questRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/quests', questRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/chat', chatRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Aroha backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});