import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import Recording from '@/models/Recording';

const SAFE = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
  'Accept-Ranges': 'bytes',
};

export async function GET(request, { params }) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  await connectDB();
  const rec = await Recording.findById(id).select('data mimeType');
  if (!rec) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const buffer = Buffer.from(rec.data);
  const total = buffer.length;

  // iPhones need "range" support to play and seek in audio
  const range = request.headers.get('range');
  const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
  if (m && (m[1] || m[2])) {
    let start;
    let end;
    if (m[1] === '') {
      start = Math.max(total - Number(m[2]), 0);
      end = total - 1;
    } else {
      start = Number(m[1]);
      end = m[2] === '' ? total - 1 : Math.min(Number(m[2]), total - 1);
    }
    if (start >= total || start > end) {
      return new Response(null, {
        status: 416,
        headers: { ...SAFE, 'Content-Range': `bytes */${total}` },
      });
    }
    return new Response(buffer.subarray(start, end + 1), {
      status: 206,
      headers: {
        ...SAFE,
        'Content-Type': rec.mimeType,
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Content-Length': String(end - start + 1),
      },
    });
  }

  return new Response(buffer, {
    headers: { ...SAFE, 'Content-Type': rec.mimeType, 'Content-Length': String(total) },
  });
}