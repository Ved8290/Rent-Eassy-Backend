const Renter = require('../Modules/Renter');
const Router = require('express').Router();
const RentData = require('../Modules/RentData');


Router.post('/renter/:id/pay', async (req, res) => {
    const { id } = req.params;
    const { rent, date, ownerID } = req.body;

    try {
        const newEntry = await RentData.create({
            Rid: id,
            rent,
            date,
            ownerID,
            status: 'paid'
        });

        const updatedRenter = await Renter.findByIdAndUpdate(
            id,
            { status: 'paid' },
            { new: true }
        );

        if (!updatedRenter) {
            return res.status(404).json({
                success: false,
                message: 'Renter not found'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            rentData: newEntry,
            renter: updatedRenter
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = Router;