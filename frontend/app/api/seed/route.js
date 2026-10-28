import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';

export async function GET() {
  await connectDB();

  const samples = [1, 2, 3].map((n) => ({
    number: n,
    slug: `test-fatwa-${n}`,
    titleOromo: `TEST title ${n}`,
    questionOromo: `TEST question ${n}`,
    answerOromo: `TEST answer ${n}\nSecond line of the test answer.`,
    youtubeUrl: '', // paste one real Africa TV video link here for fatwa 1
    status: 'Published',
    publishedAt: new Date(),
  }));

  for (const s of samples) {
    await Fatwa.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
  }
  return NextResponse.json({ ok: true, count: samples.length });
}