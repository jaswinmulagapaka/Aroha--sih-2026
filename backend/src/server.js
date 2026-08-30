const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT THE NEW CAREER ROUTES HERE
const careerRoutes = require('./routes/careerRoutes');
const userRoutes = require('./routes/userRoutes');
const questRoutes = require('./routes/questRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Added chatRoutes import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/quests', questRoutes);
app.use('/api/resume', resumeRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Aroha backend is running"
  });
});

// 2. CONNECT THE CAREER ROUTES HERE
app.use('/api/careers', careerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/chat', chatRoutes); // Connected the chat route here

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});