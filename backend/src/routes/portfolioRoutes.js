// src/routes/portfolioRoutes.js

const express = require('express');
const router = express.Router();

const { getPortfolio } = require('../controllers/portfolioController');

// GET /api/portfolio/:userId -> a user's completed quests (their "proof")
router.get('/:userId', getPortfolio);

module.exports = router;
