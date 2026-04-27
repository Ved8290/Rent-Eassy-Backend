const Renter = require('../Modules/Renter');
const Router = require('express').Router();


Router.get('/renters/:ownerID', async (req, res) => {
    try {
        const { ownerID } = req.params;

        if (!ownerID) {
            return res.status(400).json({ message: "ownerID is required" });
        }

        const renters = await Renter.find({ ownerID }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: renters.length,
            data: renters
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


Router.get('/renters/:Rid', async (req, res) => {
    try {
        const {Rid} = req.params;
        const renter = await Renter.findOne({Rid});
        if (!renter) {
            return res.status(404).json({
                success: false,
                message: 'Renter not found'
            });
        }

        res.status(200).json({
            success: true,
            data: renter
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

Router.delete('/renter/delete/:Rid',async(req,res)=>{
    const {Rid}= req.params;
    try{
        const result= await Renter.findByIdAndDelete(Rid);
        if(!result){
            return res.status(404).json({
                success: false,
                message: 'Renter not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Renter deleted successfully'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

Router.patch('/renter/markPaid/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await Renter.findByIdAndUpdate(
            id,
            { status: "paid" },
            { new: true }
        );

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Renter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Updated',
            data: response
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

Router.get('/renters/search/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const renter = await Renter.findById(id);

        if (!renter) {
            return res.status(404).json({
                success: false,
                message: 'Renter not found'
            });
        }
        res.status(200).json({
            success: true,
            data: renter
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = Router;