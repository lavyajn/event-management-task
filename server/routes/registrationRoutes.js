const express = require('express');
const router = express.Router();
const { registerForEvent, cancelRegistration } = require('../controllers/registrationController.js');

//POST endpointfor creating a new event
router.post('/', registerForEvent);
router.delete('/', cancelRegistration);

module.exports = router;
