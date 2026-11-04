import { NextResponse, after } from 'next/server';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import { sendEmail } from '@/lib/email';

// simple rate limit: max 5 questions per IP in 10 minutes
const hits = new Map();
function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (tooMany(ip)) {
      return NextResponse.json(
        { error: 'Too many questions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // honeypot: real people never fill this hidden field, bots do
    if (body.website) return NextResponse.json({ ok: true });

    const question = String(body.question || '').trim();
    const email = String(body.email || '').trim();

    if (question.length < 5 || question.length > 2000) {
      return NextResponse.json(
        { error: 'Question must be between 5 and 2000 characters.' },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email address is not valid.' }, { status: 400 });
    }

    await connectDB();
    const saved = await Fatwa.create({
      questionOromo: question,
      askerEmail: email || undefined,
      notifyAsker: Boolean(email && body.notify),
      status: 'Pending',
    });

    // email the Sheikh AFTER the response is sent, so a mail problem
    // never slows down or breaks the asker's submission
    after(async () => {
      const to = process.env.ADMIN_NOTIFY_EMAIL;
      if (!to) return;
      const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
      const preview = question.length > 500 ? `${question.slice(0, 500)}...` : question;
      await sendEmail({
        to,
        subject: 'New question received',
        text:
          `A new question was submitted:\n\n${preview}\n\n` +
          `Open it to write the answer (login required):\n` +
          `${siteUrl}/admin/fatwas/${saved._id}\n`,
      });
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/questions failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}