import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import { getYouTubeId } from '@/components/YouTubeEmbed';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';

export async function POST(request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const questionOromo = String(body.questionOromo || '').trim();
    const answerOromo = String(body.answerOromo || '').trim();
    const youtubeUrl = String(body.youtubeUrl || '').trim();
    const category = String(body.category || '').trim();

    if (questionOromo.length < 5 || questionOromo.length > 2000) {
      return NextResponse.json({ error: 'Question must be 5 to 2000 characters.' }, { status: 400 });
    }
    if (answerOromo.length > 20000) {
      return NextResponse.json({ error: 'The answer is too long.' }, { status: 400 });
    }
    if (youtubeUrl && !getYouTubeId(youtubeUrl)) {
      return NextResponse.json({ error: 'The YouTube link is not valid.' }, { status: 400 });
    }
    if (category && !mongoose.isValidObjectId(category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    await connectDB();
    if (category && !(await Category.exists({ _id: category }))) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 400 });
    }

    const fatwa = await Fatwa.create({
      questionOromo,
      answerOromo: answerOromo || undefined,
      youtubeUrl: youtubeUrl || undefined,
      category: category || undefined,
      status: 'Draft',
    });

    return NextResponse.json({ ok: true, id: String(fatwa._id) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/fatwas failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}