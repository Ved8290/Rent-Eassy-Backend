const cron = require('node-cron');
const Renter = require('./Modules/Renter'); // adjust path if needed

// ── Helper: calculate status ─────────────────────────
function computeStatus(dueDay, currentStatus) {
  const todayDate = new Date().getDate();

  if (currentStatus === 'paid') {
    return { status: 'paid', daysLate: 0, daysUntilDue: 0 };
  }

  if (todayDate === dueDay) {
    return { status: 'due', daysLate: 0, daysUntilDue: 0 };
  }

  if (todayDate > dueDay) {
    const daysLate = todayDate - dueDay;
    return { status: 'overdue', daysLate, daysUntilDue: 0 };
  }

  const daysUntilDue = dueDay - todayDate;
  return { status: 'upcoming', daysLate: 0, daysUntilDue };
}

// ── MAIN CRON FUNCTION ─────────────────────────
function startCronJobs() {
  cron.schedule('30 0 * * *', async () => {
    console.log("⏰ Running daily rent status update...");

    try {
      const renters = await Renter.find();

      let updated = 0;

      for (const renter of renters) {

        // ✅ Safety checks
        if (!renter.day) continue;
        if (!renter.ownerID) continue;

        const { status, daysLate, daysUntilDue } =
          computeStatus(renter.day, renter.status);

        await Renter.findByIdAndUpdate(renter._id, {
          status,
          daysLate,
          daysUntilDue
        });

        updated++;
      }

      console.log(`✅ Cron Update Done — ${updated} renters updated`);

    } catch (err) {
      console.error("❌ Cron Error:", err.message);
    }

  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log("🚀 Cron scheduled at 6:00 AM IST");
}

module.exports = { startCronJobs };