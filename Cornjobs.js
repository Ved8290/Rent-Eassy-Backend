const cron = require('node-cron');
const { updateRenterStatuses } = require('./Cronscheduler');

function startCronJobs() {
  cron.schedule('0 6 * * *', async () => {
    console.log("⏰ Running rent status update...");

    try {
      await updateRenterStatuses(); // ✅ FIXED
    } catch (err) {
      console.error("❌ Cron Error:", err.message);
    }

  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log("🚀 Cron scheduled (everyday at 6AM)");
}

module.exports = { startCronJobs };