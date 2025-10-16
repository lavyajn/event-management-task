const express = require('express');
const router = express.Router();
const { createEvent, getEventDetails, getEventStats } = require('../controllers/eventController.js');

// creating a new event using POST 
router.post('/', createEvent);

// GET endpoint for the event detail
router.get('/:id', getEventDetails);

//GET endpoint for the event stats
router.get('/:id/stats', getEventStats);

module.exports = router;
