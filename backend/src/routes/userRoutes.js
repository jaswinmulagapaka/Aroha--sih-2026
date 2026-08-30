// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { createUser, getUserDashboard } = require('../controllers/userController');

// POST /api/users            -> onboard a new user (Steps 3-5)
router.post('/', createUser);

// GET /api/users/:id/dashboard -> fetch a user's profile
router.get('/:id/dashboard', getUserDashboard);

module.exports = router;
