import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import { getYouTubeId } from '@/components/YouTubeEmbed';
import Program from '@/models/Program';
import Episode from '@/models/Episode';

export async function POST(request, { params }) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    const body = await request.json();
    const lines = String(body.text || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return NextResponse.json({ error: 'Paste at least one YouTube link.' }, { status: 400 });
    }
    if (lines.length > 100) {
      return NextResponse.json({ error: 'Add at most 100 parts at a time.' }, { status: 400 });
    }

    await connectDB();
    const program = await Program.findById(id).lean();
    if (!program) {
      return NextResponse.json({ error: 'Program not found.' }, { status: 404 });
    }

    const existing = await Episode.find({ program: id }).select('youtubeId number').lean();
    const usedIds = new Set(existing.map((e) => e.youtubeId));
    let next = Math.max(0, ...existing.map((e) => e.number)) + 1;

    // check every line first; nothing is saved if any line has a problem
    const errors = [];
    const docs = [];

    lines.forEach((line, i) => {
      const parts = line.split('|');
      const link = parts[parts.length - 1].trim();
      const title = parts.length > 1 ? parts.slice(0, -1).join('|').trim() : '';
      const videoId = getYouTubeId(link);

      if (!videoId) {
        errors.push(`Line ${i + 1}: the YouTube link is not valid.`);
        return;
      }
      if (usedIds.has(videoId)) {
        errors.push(`Line ${i + 1}: this video is already in the program.`);
        return;
      }
      if (title.length > 150) {
        errors.push(`Line ${i + 1}: the title is too long.`);
        return;
      }
      usedIds.add(videoId);
      docs.push({
        program: id,
        number: next,
        titleOromo: title || `Kutaa ${next}`,
        youtubeId: videoId,
      });
      next += 1;
    });

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    await Episode.insertMany(docs);
    return NextResponse.json({ ok: true, added: docs.length }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/programs/[id]/episodes failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}