import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import Program from '@/models/Program';

function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['’‘ʼ`´]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'program'
  );
}

export async function POST(request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const titleOromo = String(body.titleOromo || '').trim();
    const descriptionOromo = String(body.descriptionOromo || '').trim();

    if (titleOromo.length < 2 || titleOromo.length > 120) {
      return NextResponse.json({ error: 'The title must be 2 to 120 characters.' }, { status: 400 });
    }
    if (descriptionOromo.length > 2000) {
      return NextResponse.json({ error: 'The description is too long.' }, { status: 400 });
    }

    await connectDB();

    const base = slugify(titleOromo);
    let slug = base;
    let n = 2;
    while (await Program.exists({ slug })) {
      slug = `${base}-${n}`;
      n += 1;
    }

    const program = await Program.create({
      titleOromo,
      descriptionOromo: descriptionOromo || undefined,
      slug,
    });

    return NextResponse.json({ ok: true, id: String(program._id) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/programs failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}