const express = require('express');
const router = express.Router();
const Renter = require('../Modules/Renter');

// POST: Trigger rent status update manually
router.post('/update-rent-status/:ownerID', async (req, res) => {
  const today = new Date().getDate();
  const { ownerID } = req.params;

  try {
    const renters = await Renter.find({ ownerID });

    let updatedRenters = [];

    for (const renter of renters) {

      // ✅ Skip invalid data
      if (!renter.day) continue;

      // ✅ Skip paid users
      if (renter.status === 'paid') continue;

      const dueDay = renter.day;
      const daysUntilDue = dueDay - today;

      let newStatus = renter.status;

      if (daysUntilDue < 0) {
        newStatus = 'overdue';
      } else if (daysUntilDue === 0) {
        newStatus = 'due';
      } else {
        newStatus = 'upcoming'; // ✅ IMPORTANT FIX
      }

      const updated = await Renter.findByIdAndUpdate(
        renter._id,
        {
          status: newStatus,
          daysLate: Math.max(0, -daysUntilDue),
          daysUntilDue: Math.max(0, daysUntilDue)
        },
        { new: true } // ✅ returns updated doc
      );

      updatedRenters.push(updated);
    }

    res.json({
      success: true,
      count: updatedRenters.length,
      data: updatedRenters
    });

  } catch (err) {
    console.error("🔥 FULL ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;