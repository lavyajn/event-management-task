const express = require('express');
const router = express.Router();
const { createEvent, getEventDetails } = require('../controllers/eventController.js');

// creating a new event using POST 
router.post('/', createEvent);

// GET endpoint for the event detail
router.get('/', getEventDetails);

module.exports = router;
