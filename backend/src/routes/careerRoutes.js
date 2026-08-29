const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

router.get('/', careerController.getAllCareers);
router.get('/:careerName', careerController.getCareerByName);

module.exports = router;