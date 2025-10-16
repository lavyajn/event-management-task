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

const getEventDetails = async(req, res) => {
    const { id } = req.params;

    try {
        const eventSql = `SELECT * FROM events WHERE id = $1`;
        const eventResult = await db.query(eventSql, [id]);

        if(eventResult.rows.length === 0) {
            return res.status(404).json({message: 'Event not found.'});
        }
        const eventDetails = eventResult.rows[0];

        const userSql = `
        SELECT 
        u.id, u.name, u.email
        FROM users u
        JOIN event_registration r on u.id = r.user_id
        WHERE r.event_id = $1;
        `;
        const userResult = await db.query(userSql, [id]);

        const response = {
            ...eventDetails,//spread syntax
            registeredUsers: userResult.rows
        };
        res.status(200).json(response);
    }catch(err) {
        console.error('Error while fetching details', err);
        res.status(500).json({message: 'Internal server error.'})
    }
};

const getEventStats = async(req, res) => {
    const { id } = req.params;
    
    try {
        const statsSql = `
        SELECT
        e.capacity,
        COUNT(r.event_id) AS registration_count
        FROM events e
        LEFT JOIN event_registration r on e.id = r.event_id
        WHERE e.id = $1
        GROUP BY e.id;
        `;
        const statsResult = await db.query(statsSql, [id]);

        if(statsResult.rows.length === 0) {
            return res.status(404).json({message: 'Event not found'});
        }

        const stats = statsResult.rows[0];
        const capacity = parseInt(stats.capacity, 10);
        const totalRegistrations = parseInt(stats.registration_count, 10);

        //calculation for data to be send
        const remainingCapacity = capacity - totalRegistrations ;
        const percentageUsed = capacity > 0 ? (totalRegistrations / capacity)*100 : 0;

        const response = {
            totalRegistrations,
            remainingCapacity,
            percentageOfCapacityUsed :`${percentageUsed.toFixed(2)}%`
        };
        res.status(200).json(response);   
    }catch(err) {
        console.error('Error fetching event stats:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const listUpcomingEvents = async(req, res) => {
    try {
        const sql = `
        SELECT * FROM events
        WHERE date > NOW()
        ORDER BY date ASC, location ASC
        `;
        const result = await db.query(sql);
        if(result.rows.length === 0) {
            return res.status(200).json({message: 'No upcoming events.'});
        }
        res.status(200).json(result.rows);
    }catch(err) {
        console.error('Error fetching upcoming events:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createEvent,
    getEventDetails,
    getEventStats,
    listUpcomingEvents,
}

/* 
{
    "userId": "14b11a97-d19d-42c4-94a8-e223dca0fe4b",
    "eventId": "3a80af71-7727-4a5a-93c2-ea2127209058"
}
    
{
    "title": "Archived Tech Talk 2024",
    "date": "2024-10-16T10:00:00Z",
    "location": "Pune",
    "capacity": 50
}
    
{
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
}
    
PAST EVENT
{
    "title": "Archived Tech Talk 2024",
    "date": "2024-10-16T10:00:00Z",
    "location": "Pune",
    "capacity": 50
}*/