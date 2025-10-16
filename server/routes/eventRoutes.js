const express = require('express');
const router = express.Router();
const { createEvent, getEventDetails, getEventStats, listUpcomingEvents } = require('../controllers/eventController.js');

//POST endpoint creating a new event using POST 
router.post('/', createEvent);

//GET endpoint for the event detail
router.get('/:id', getEventDetails);

//GET endpoint for the event stats
router.get('/:id/stats', getEventStats);

//GET endpoint for listing upcoming events
router.get('/', listUpcomingEvents);

module.exports = router;
