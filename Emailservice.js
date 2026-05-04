const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      
    pass: process.env.GMAIL_APP_PASS,  
  },
});

// ── Email Templates ────────────────────────────────────────

const templates = {

  reminder: (renter) => ({
    subject: `🔔 Rent Due Tomorrow — ₹${renter.rent}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #f59e0b; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0;">Rent Due Tomorrow</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${renter.name}</strong>,</p>
          <p>This is a friendly reminder that your rent is due <strong>tomorrow</strong>.</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Rent Amount</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>₹${renter.rent}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Due Date</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Day ${renter.day} of this month</strong></td>
            </tr>
           
          </table>
          <p>Please ensure timely payment to avoid any late fees.</p>
          <p style="color: #6b7280; font-size: 13px;">— RentFlow </p>
        </div>
      </div>
    `,
  }),

  due: (renter) => ({
    subject: `⚠️ Rent Due Today — ₹${renter.rent}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #ef4444; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0;">Rent Due Today</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${renter.name}</strong>,</p>
          <p>Your rent of <strong>₹${renter.rent}</strong> is due <strong>today</strong>. Please make your payment as soon as possible.</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Rent Amount</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>₹${renter.rent}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Due Date</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Today</strong></td>
            </tr>
           
          </table>
          <p style="color: #6b7280; font-size: 13px;">— RentFlow </p>
        </div>
      </div>
    `,
  }),

  overdue: (renter) => ({
    subject: `🚨 Rent Overdue by ${renter.daysLate} Day(s) — ₹${renter.rent}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #7f1d1d; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0;">⚠️ Rent Overdue</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${renter.name}</strong>,</p>
          <p>Your rent payment is <strong>${renter.daysLate} day(s) overdue</strong>. Please pay immediately to avoid further action.</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #fef2f2;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Rent Amount</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>₹${renter.rent}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Days Late</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; color: #dc2626;"><strong>${renter.daysLate} day(s)</strong></td>
            </tr>
            <tr style="background: #fef2f2;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Original Due Day</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Day ${renter.day} of this month</td>
            </tr>
           
          </table>
          <p>If you have already made payment, please ignore this message or contact us.</p>
          <p style="color: #6b7280; font-size: 13px;">— RentFlow </p>
        </div>
      </div>
    `,
  }),

};

// ── Send Email ─────────────────────────────────────────────

const sendRentEmail = async (renter, type) => {
  const template = templates[type](renter);
  try {
    await transporter.sendMail({
      from: `"Property Management" <${process.env.GMAIL_USER}>`,
      to: renter.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`[EMAIL] ✅ ${type.toUpperCase()} email sent to ${renter.email}`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] ❌ Failed to send to ${renter.email}:`, err.message);
    return false;
  }
};

module.exports = { sendRentEmail };