const express = require('express');
const router = express.Router();
const { updateRenterStatuses } = require('../Cronscheduler'); 

/**
 * POST /api/cron/run

 */
router.post('/run', async (req, res) => {
  try {
    console.log('[MANUAL TRIGGER] Rent status update triggered via API');
    await updateRenterStatuses();
    res.json({
      success: true,
      message: 'Renter statuses updated successfully.',
      triggeredAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update renter statuses.',
      error: error.message,
    });
  }
});

/**
 * GET /api/cron/status
 */
router.get('/status', async (req, res) => {
  try {
    const Renter = require('../models/Renter'); // adjust path

    const summary = await Renter.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRent: { $sum: '$rent' },
        },
      },
    ]);

    const overdueRenters = await Renter.find({ status: 'overdue' })
      .select('name Rid email mobaile rent day daysLate')
      .sort({ daysLate: -1 });

    res.json({
      success: true,
      summary,
      overdueRenters,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;