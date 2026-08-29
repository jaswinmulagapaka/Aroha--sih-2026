const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple API route for testing backend connection
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', app: 'Aroha Landing Page API' });
});

app.listen(PORT, () => {
    console.log(`Aroha server running on port ${PORT}`);
});