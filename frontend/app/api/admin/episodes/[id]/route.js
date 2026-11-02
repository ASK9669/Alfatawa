import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import Episode from '@/models/Episode';

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    await connectDB();
    await Episode.deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/episodes/[id] failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}