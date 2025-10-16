const db = require('../db.js');

const createUser = async(req, res) => {
    const { name, email } = req.body;

    if(!name || !email) {
        return res.status(400).json({message: 'Please fill the required details.'});
    }
    try{
        const sql = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING id`;

        const params = [name, email];
        const result = await db.query(sql, params);
        const newUserId = result.rows[0].id;

        res.status(201).json({message: 'User created successfully!!' ,UserId: newUserId})
    }catch(err) {
        console.error('Error creating user',err);
        res.status(500).json({message: 'Insternal server error'});
    }
};

module.exports = {
    createUser,
}