import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'admin_token';

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 8, // 8 hours
};

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET is missing or too short');
  return new TextEncoder().encode(s);
}

export async function createToken(admin) {
  return new SignJWT({ role: admin.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(admin._id))
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function getAdminFromCookie() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { id: payload.sub, role: payload.role };
  } catch {
    return null; // expired, forged, or broken token
  }
}