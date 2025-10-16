const express = require('express');
const db = require('./db.js');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const registrationRoutes = require('./routes/registrationRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Welcome to the Event Management API! The server is running.');
});

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});