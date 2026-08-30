const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

// Configure multer to store files in memory as a buffer
const upload = multer({ storage: multer.memoryStorage() });

// The 'resume' string is the form-data key the client must use when uploading
router.post('/upload', upload.single('resume'), resumeController.uploadResume);

module.exports = router;