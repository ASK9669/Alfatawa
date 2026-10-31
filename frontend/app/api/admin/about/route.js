import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import About from '@/models/About';

// one item per line, empty lines removed, limits on how many and how long
function lines(value, maxItems, maxLength) {
  return String(value || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((l) => l.slice(0, maxLength));
}

export async function PUT(request) {
  try {
    // only a logged-in admin may continue
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const nameOromo = String(body.nameOromo || '').trim().slice(0, 200);
    const nameArabic = String(body.nameArabic || '').trim().slice(0, 200);
    const photoUrl = String(body.photoUrl || '').trim();
    const biographyOromo = String(body.biographyOromo || '').trim();
    const biographyArabic = String(body.biographyArabic || '').trim();

    // photo: a file in the public folder (/sheikh.jpg) or an https address
    if (photoUrl && !/^(\/[A-Za-z0-9._\-\/]+|https:\/\/\S+)$/.test(photoUrl)) {
      return NextResponse.json(
        { error: 'Photo must look like /sheikh.jpg or start with https://' },
        { status: 400 }
      );
    }
    if (biographyOromo.length > 20000 || biographyArabic.length > 20000) {
      return NextResponse.json({ error: 'A biography is too long.' }, { status: 400 });
    }

    const education = lines(body.education, 30, 300);
    const works = lines(body.works, 50, 300);
    const timeline = lines(body.timeline, 50, 400)
      .map((line) => {
        const i = line.indexOf('|');
        if (i === -1) return { year: '', text: line };
        return { year: line.slice(0, i).trim().slice(0, 20), text: line.slice(i + 1).trim() };
      })
      .filter((t) => t.text);

    await connectDB();
    await About.findOneAndUpdate(
      { key: 'sheikh' },
      {
        $set: {
          nameOromo, nameArabic, photoUrl,
          biographyOromo, biographyArabic,
          education, works, timeline,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PUT /api/admin/about failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}