import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, text }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email is not configured. Email skipped.');
    return { ok: false, error: 'not configured' };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    // we log the reason but never the recipient's address
    console.error('Email failed:', error.message);
    return { ok: false, error: error.message };
  }
}