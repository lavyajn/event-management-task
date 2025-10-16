const express = require('express');
const router = express.Router();
const { registerForEvent, cancelRegistration } = require('../controllers/registrationController.js');

// creating a new event using POST 
router.post('/', registerForEvent);
router.delete('/', cancelRegistration);

module.exports = router;
