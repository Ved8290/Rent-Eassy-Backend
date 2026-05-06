const cron = require('node-cron');
const Renter = require('./Modules/Renter');
const { sendRentEmail } = require('./Emailservice');

const updateRenterStatuses = async () => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const renters = await Renter.find({});
    const bulkOps = [];

    for (const renter of renters) {
      const dueDay = renter.day;

      const dueDate = new Date(currentYear, currentMonth, dueDay);
      dueDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let newStatus = renter.status;
      let newDaysLate = 0;
      let emailType = null; // 'reminder' | 'due' | 'overdue' | null

      if (renter.status === 'paid') {
        // Reset paid → upcoming at start of new billing cycle
        if (today < dueDate) {
          const lastUpdate = new Date(renter.updatedAt);
          if (
            lastUpdate.getFullYear() < currentYear ||
            (lastUpdate.getFullYear() === currentYear &&
              lastUpdate.getMonth() < currentMonth)
          ) {
            newStatus = 'upcoming';
            newDaysLate = 0;
          }
        }

      } else {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.round((dueDate - today) / msPerDay);

        if (diffDays === 1) {
          // 1 day before due → reminder email, status stays upcoming
          newStatus = 'upcoming';
          newDaysLate = 0;
          emailType = 'reminder';

        } else if (diffDays === 0) {
          // Due today
          newStatus = 'due';
          newDaysLate = 0;
          emailType = 'due';

        } else if (diffDays < 0) {
          // Overdue — email every day
          newStatus = 'overdue';
          newDaysLate = Math.abs(diffDays);
          emailType = 'overdue';

        } else {
          // Upcoming (more than 1 day away)
          newStatus = 'upcoming';
          newDaysLate = 0;
        }
      }

      // Send email if needed
      if (emailType) {
        await sendRentEmail(
          { ...renter.toObject(), daysLate: newDaysLate },
          emailType
        );
      }

      // Queue DB update only if something changed
      if (newStatus !== renter.status || newDaysLate !== renter.daysLate) {
        bulkOps.push({
          updateOne: {
            filter: { _id: renter._id },
            update: { $set: { status: newStatus, daysLate: newDaysLate } },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      const result = await Renter.bulkWrite(bulkOps);
      console.log(`[CRON] ${new Date().toISOString()} — Updated ${result.modifiedCount} renter(s).`);
    } else {
      console.log(`[CRON] ${new Date().toISOString()} — No status changes needed.`);
    }

  } catch (error) {
    console.error('[CRON] Error:', error.message);
  }
};

const startRentStatusCron = () => {
  // Runs every day at 6:00 AM 
  cron.schedule('0 6 * * *', async () => {
    console.log('[CRON] Running rent status + email job...');
    await updateRenterStatuses();
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('[CRON] Scheduler started — runs daily at 6:00 AM IST');
};

module.exports = { startRentStatusCron, updateRenterStatuses };