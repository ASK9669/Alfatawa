import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { createToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';

// used when the email doesn't exist, so response time doesn't reveal it
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

// max 5 attempts per IP in 15 minutes (simple version, like the question form)
const attempts = new Map();
function tooMany(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (tooMany(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    await connectDB();

    const admin = await Admin.findOne({
      email: String(email || '').toLowerCase().trim(),
    });

    const ok = await bcrypt.compare(
      String(password || ''),
      admin ? admin.passwordHash : DUMMY_HASH
    );

    if (!admin || !ok) {
      return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
    }

    attempts.delete(ip);
    const token = await createToken(admin);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (error) {
    console.error('POST /api/auth/login failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}