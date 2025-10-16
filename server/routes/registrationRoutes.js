const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/registrationController.js');

// creating a new event using POST 
router.post('/', registerForEvent);

module.exports = router;
