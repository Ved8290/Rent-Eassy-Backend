const Router = require('express').Router();
const Renter = require('../Modules/Renter');

Router.post('/add/newrenter', async (req, res) => {
    try {
        const { name , email ,  mobaile , rent , day , ownerID } = req.body;
        const Rid = Date.now().toString();
        const newRenter = new Renter({ Rid, name , email , mobaile , rent , day , ownerID });
        await newRenter.save();
        res.status(201).json({ message: 'New Renter added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
});


module.exports = Router;
