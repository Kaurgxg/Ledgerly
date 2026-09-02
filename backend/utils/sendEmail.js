const nodemailer = require('nodemailer');

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Password reset email is not configured. Add EMAIL_USER and EMAIL_APP_PASSWORD to backend/.env.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Ledgerly <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your Ledgerly password',
    text: `Hi ${name},\n\nWe received a request to reset your Ledgerly password. Use this link within 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hi ${name},</p><p>We received a request to reset your Ledgerly password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}

module.exports = { sendPasswordResetEmail };
