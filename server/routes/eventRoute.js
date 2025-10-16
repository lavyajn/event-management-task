const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/eventController.js');

// creating a new event using POST 
router.post('/', createEvent);

module.exports = router;
