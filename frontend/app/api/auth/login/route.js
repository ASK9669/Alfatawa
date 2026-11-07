import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { createToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';
import { isLimited, clearLimit, getClientIp } from '@/lib/rateLimit';

// used when the email doesn't exist, so response time doesn't reveal it
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function POST(request) {
  try {
    // max 5 attempts per address in 15 minutes
    const limitKey = `login:${getClientIp(request)}`;
    if (await isLimited(limitKey, 5, 15 * 60)) {
      return NextResponse.json(
        { error: 'Yeroo hedduuf yaaltee jirtaa !!.' },
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

    await clearLimit(limitKey);
    const token = await createToken(admin);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (error) {
    console.error('POST /api/auth/login failed:', error);
    return NextResponse.json({ error: 'Dogongoratu jira.' }, { status: 500 });
  }
}