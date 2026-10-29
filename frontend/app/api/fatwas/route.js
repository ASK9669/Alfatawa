import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';

export async function GET() {
  try {
    await connectDB();
    const fatwas = await Fatwa.find({ status: 'Published' })
      .sort({ publishedAt: -1 })
      .lean();
    return NextResponse.json(fatwas);
  } catch (error) {
    console.error('GET /api/fatwas failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}