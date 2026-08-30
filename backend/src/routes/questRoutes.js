// src/routes/questRoutes.js

const express = require('express');
const router = express.Router();

const { getRoadmap, getQuests, completeQuest } = require('../controllers/questController');

// GET /api/quests/roadmap/:userId -> get (or generate) a user's roadmap
router.get('/roadmap/:userId', getRoadmap);

// GET /api/quests/:userId -> get (or generate) a user's quests
router.get('/:userId', getQuests);

// POST /api/quests/complete -> mark a quest completed, update skills + readiness score
router.post('/complete', completeQuest);

module.exports = router;
