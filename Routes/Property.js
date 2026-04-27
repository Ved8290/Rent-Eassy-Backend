const Router = require('express').Router();
const Property = require('../Modules/Property');

Router.post('/add', async (req, res) => {
    try {
        const { city, numberOfRooms, name, owner } = req.body;
        const uid = Date.now().toString();
        const newProperty = new Property({ uid, city, numberOfRooms, name, owner });
        await newProperty.save();
        res.status(201).json({ message: 'Property added successfully' });
    } catch (error) {
        console.error("🔥 REAL ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

  


module.exports = Router;
