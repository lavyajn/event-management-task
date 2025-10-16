const db = require('../db.js');

const registerForEvent = async(req, res) => {
    const { userId, eventId } = req.body;

    if(!eventId || !userId) {
        return res.status(400).json({message: 'UserId and EventId are required.'});
    }
    try {
        // checking for existing user first 
        const duplicateCheck = 'SELECT * FROM event_registration WHERE user_id = $1 AND event_id = $2';
        const duplicateResult = await db.query(duplicateCheck, [userId, eventId]);
        if(duplicateResult.rows.length > 0) {
            return res.status(409).json({message: 'User is already registered for this event.'});
        }

        const eventCheck = `
        SELECT 
        e.date,
        e.capacity,
        COUNT(r.event_id) AS registration_count
        FROM events e
        LEFT JOIN event_registration r on e.id = r.event_id
        WHERE e.id = $1
        GROUP BY e.id
        `;
        const eventResult = await db.query(eventCheck, [eventId]);

        if(eventResult.rows.length === 0) {
            return res.status(404).json({message: 'Event Not Found !!'});
        }

        const event = eventResult.rows[0];
        //converting string to integer
        const registrationCount = parseInt(event.registration_count, 10);

        //check for event capacity
        if(registrationCount >= event.capacity) {
            return res.status(400).json({message: 'Event is full.'});
        }

        //check for past event
        const eventDate = new Date(event.date);
        if(eventDate < new Date()){
            return res.status(400).json({message: 'Cannot register for a past event.'});
        }

        const registerUser = `
        INSERT INTO event_registration (user_id, event_id)
        VALUES ($1, $2)
        RETURNING *
        `;
        await db.query(registerUser, [userId, eventId]);
        res.status(201).json({message: 'Successfully registered for the event'});
    }catch(err) {
        console.error('Error during registration', err);
        res.status(500).json({message: 'Server error during registration'});
    }
};

module.exports = {
    registerForEvent,
}