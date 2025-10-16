const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController.js');

//registering the user for an event
router.post('/', createUser);

module.exports = router;