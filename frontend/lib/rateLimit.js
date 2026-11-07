import { connectDB } from '@/lib/db';
import RateLimit from '@/models/RateLimit';

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  return ip.slice(0, 64);
}

// true when this key has used up its allowance in the current time window
export async function isLimited(key, max, windowSeconds) {
  await connectDB();
  const now = new Date();

  // a live window exists: count this attempt
  const live = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true }
  );
  if (live) return live.count > max;

  // no live window: start a new one with this attempt as the first
  try {
    await RateLimit.findOneAndUpdate(
      { key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error; // two requests started a window at once
  }
  return false;
}

export async function clearLimit(key) {
  await connectDB();
  await RateLimit.deleteOne({ key });
}