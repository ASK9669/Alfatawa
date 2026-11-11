import { NextResponse, after } from 'next/server';
import { connectDB } from '@/lib/db';
import { isLimited, getClientIp } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';
import {
  MAX_BYTES,
  MAX_SECONDS,
  MAX_TOTAL_BYTES,
  MAX_PER_DAY,
  sniffAudio,
} from '@/lib/audio';
import Fatwa from '@/models/Fatwa';
import Recording from '@/models/Recording';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 3 recordings per visitor in 10 minutes, and a daily limit for everyone together
    if (
      (await isLimited(`voice:${ip}`, 3, 10 * 60)) ||
      (await isLimited('voice:all', MAX_PER_DAY, 24 * 60 * 60))
    ) {
      return NextResponse.json(
        { error: 'Too many voice questions. Please try again later.' },
        { status: 429 }
      );
    }

    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_BYTES + 200 * 1024) {
      return NextResponse.json(
        { error: 'The recording is too large. Please record a shorter question.' },
        { status: 413 }
      );
    }

    const form = await request.formData();

    // honeypot: real people never fill this hidden field, bots do
    if (form.get('website')) return NextResponse.json({ ok: true });

    const file = form.get('audio');
    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ error: 'No recording was received.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'The recording is too large. Please record a shorter question.' },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = sniffAudio(buffer);
    if (!mimeType) {
      return NextResponse.json({ error: 'This type of file is not accepted.' }, { status: 400 });
    }

    const question = String(form.get('question') || '').trim();
    const email = String(form.get('email') || '').trim();
    const seconds = Math.min(
      Math.max(Math.round(Number(form.get('seconds')) || 0), 0),
      MAX_SECONDS + 5
    );

    if (question && (question.length < 5 || question.length > 2000)) {
      return NextResponse.json(
        { error: 'The typed question must have 5 to 2000 characters, or be left empty.' },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email address is not valid.' }, { status: 400 });
    }

    await connectDB();

    // stop when the stored recordings reach the limit
    const used = await Recording.aggregate([{ $group: { _id: null, total: { $sum: '$size' } } }]);
    if ((used[0]?.total || 0) + buffer.length > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { error: 'Voice questions are not available right now. Please type your question.' },
        { status: 503 }
      );
    }

    const recording = await Recording.create({
      data: buffer,
      mimeType,
      size: buffer.length,
      seconds,
    });

    let saved;
    try {
      saved = await Fatwa.create({
        questionOromo: question || undefined,
        askerEmail: email || undefined,
        notifyAsker: Boolean(email && form.get('notify') === 'true'),
        status: 'Pending',
        audio: recording._id,
        audioSeconds: seconds,
      });
    } catch (error) {
      await Recording.deleteOne({ _id: recording._id });
      throw error;
    }
    await Recording.updateOne({ _id: recording._id }, { $set: { fatwa: saved._id } });

    // email the Sheikh AFTER the response is sent
    after(async () => {
      const to = process.env.ADMIN_NOTIFY_EMAIL;
      if (!to) return;
      const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
      await sendEmail({
        to,
        subject: 'Sagaleen Haaraan ergameera',
        text:
          `Gaafiin haaraan sagalee (${seconds} seconds).\n\n` +
          (question ? `Typed text:\n${question.slice(0, 500)}\n\n` : '') +
          `Sagalee banii dhageeffadhu :\n` +
          `${siteUrl}/admin/fatwas/${saved._id}\n`,
      });
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/questions/voice failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}