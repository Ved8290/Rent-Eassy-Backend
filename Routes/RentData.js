const Renter = require('../Modules/Renter');
const Router = require('express').Router();
const RentData = require('../Modules/RentData');

const markPaid = async (id) => {
  try {
    console.log("Marking renter as paid for ID:", id);
    await Renter.findOneAndUpdate(
      { _id: id },  
      { status: "paid", daysLate: 0 },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating renter status:", error);
  }
};

const updatePayment = async (id, status) => {
  try {
    const result = await Renter.findOneAndUpdate(
      { Rid: id },
      { status: status },
      { new: true }
    );

    console.log("Update Result:", result); // 👈 ADD THIS

  } catch (error) {
    console.error("Error updating renter status:", error);
  }
};

Router.post('/renter/:id/:status', async (req, res) => {
  const { id, status } = req.params;

  try {
    const updated = await Renter.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Renter not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Renter marked as ${status}`,
      data: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

Router.post('/renter/:id/pay/:ownerID', async (req, res) => {
  try {
    const { id, ownerID } = req.params;
    const { rent, date, month } = req.body;

    // ✅ Save payment
    const newPayment = new RentData({
      Rid: id,
      ownerID: ownerID,
      rent,
      date,
      month
    });

    await newPayment.save();

    // ✅ Update renter status
    await markPaid(id);

    res.status(201).json({
      message: "Payment saved successfully",
      data: newPayment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


Router.get('/renters/rentData/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const renterData = await RentData.find({Rid:id});

        if (!renterData) {
            return res.status(404).json({
                success: false,
                message: 'No rent data found for this renter'
            });
        }
        if (renterData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No rent data found for this renter'
            });
        }
        res.status(200).json({
            success: true,
            data: renterData
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