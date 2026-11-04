import nodemailer from 'nodemailer';

const to = process.argv[2];
if (!to) {
  console.error('Usage: node --env-file=.env.local scripts/test-email.mjs your@address.com');
  process.exit(1);
}

const port = Number(process.env.SMTP_PORT || 465);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

try {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Test email',
    text: 'If you can read this, email sending works.',
  });
  console.log('Sent. Check the inbox and the spam folder.');
} catch (error) {
  console.error('Failed:', error.message);
}
