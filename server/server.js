const express = require('express');
const db = require('./db.js');
const eventRoutes = require('./routes/eventRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const registrationRoutes = require('./routes/registrationRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.json());

/* app.get('/test-db', async (req, res) => {
    try{
        const result = await db.query('SELECT NOW()');
        res.status(200).json({
            message: 'Databse connection successfull!!',
            time: result.rows[0],
        });
    }catch(err) {
        console.error('Database connection failed !!', err.stack);
        res.status(500).json({message: 'Failed to connect to database.'});
    }
}); */

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});