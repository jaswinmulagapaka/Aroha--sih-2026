// src/routes/chatRoutes.js
//
// Follows the same pattern as userRoutes.js / questRoutes.js: the router
// itself only defines the sub-path, and the full "/api/chat" prefix is
// added when this router is mounted in server.js.

const express = require('express');
const router = express.Router();

const { handleChat } = require('../controllers/chatController');

// POST /api/chat -> ask Aroha a career/coding question
router.post('/', handleChat);

module.exports = router;
