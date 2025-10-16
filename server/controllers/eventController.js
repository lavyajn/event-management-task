const db = require('../db.js');

const createEvent = async(req, res) => {
    const { title, date, location, capacity } = req.body;

    if(!title || !date || !location || !capacity ) {
        return res.status(400).json({message: 'Please fill all the required fields.'})
    }
    if(typeof capacity !== 'number' || !(capacity>0 && capacity<=1000)){
        return res.status(400).json({message: 'Capacity should be a number and between 1 and 1000'});
    }
    try {
        const sqlQuery = `INSERT INTO events (title, date, location, capacity)
        VALUES ($1, $2, $3, $4)
        RETURNING id`;

        // using paramerterised query for preventing sql injection
        const params = [title, date, location, capacity];
        const result = await db.query(sqlQuery, params);
        const newEventId = result.rows[0].id;

        // responding with eventId
        res.status(201).json({message: 'Event created successfully!!' ,eventId: newEventId});
    }catch(err){
        console.error('Error creating event', err);
        res.status(500).json({error: 'Internal server error.'});
    }
};

module.exports = {
    createEvent,
}