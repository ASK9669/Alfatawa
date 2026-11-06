import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { getYouTubeId } from '@/components/YouTubeEmbed';
import Fatwa from '@/models/Fatwa';
import Counter from '@/models/Counter';
import Category from '@/models/Category';

const ALLOWED_STATUS = ['Draft', 'Published', 'Rejected'];

export async function PUT(request, { params }) {
  try {
    // 1. only a logged-in admin may continue
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    // 2. read only the fields we allow
    const body = await request.json();
    const status = String(body.status || '');
    const questionOromo = String(body.questionOromo || '').trim();
    const answerOromo = String(body.answerOromo || '').trim();
    const youtubeUrl = String(body.youtubeUrl || '').trim();
    const category = String(body.category || '').trim();

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
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
    if (status === 'Published' && !answerOromo) {
      return NextResponse.json({ error: 'Write the answer before publishing.' }, { status: 400 });
    }
    if (status === 'Published' && !category) {
      return NextResponse.json({ error: 'Choose a category to publish.' }, { status: 400 });
    }

    await connectDB();

    if (category && !(await Category.exists({ _id: category }))) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 400 });
    }

    // +askerEmail: the email is hidden by default, so we ask for it explicitly
    const fatwa = await Fatwa.findById(id).select('+askerEmail');
    if (!fatwa) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // 3. apply the changes
    fatwa.questionOromo = questionOromo;
    fatwa.answerOromo = answerOromo;
    fatwa.youtubeUrl = youtubeUrl;
    fatwa.category = category || undefined;
    fatwa.status = status;

    // 4. first publication: number, slug, date
    if (status === 'Published') {
      if (!fatwa.number) {
        const counter = await Counter.findOneAndUpdate(
          { _id: 'fatwa' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        fatwa.number = counter.seq;
      }
      if (!fatwa.slug) {
        fatwa.slug = `fatwa-${fatwa.number}`;
      }
      if (!fatwa.publishedAt) {
        fatwa.publishedAt = new Date();
      }
    }

    await fatwa.save();

    // 5. tell the asker (only once, only if they asked for it)
    let emailStatus = 'not_requested';
    if (status === 'Published' && fatwa.notifyAsker && fatwa.askerEmail) {
      if (fatwa.notifiedAt) {
        emailStatus = 'already_sent';
      } else {
        const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
        const result = await sendEmail({
          to: fatwa.askerEmail,
          subject: `Deebii Gaafii keetii (Fatwa No. ${fatwa.number})`,
          text:
            `Gaafii Fatwaa ati gaafatteef Deebiin isaa lakk ${fatwa.slug} irratti siif deebi'ee jira.\n\n` +
            `Deebii isaa argachuuf liinkii armaan gadii tuqi:\n${siteUrl}/fatwas/${fatwa.slug}\n\n` +
            `Ergaan kun kan siif ergameef Deebii gaafii keetii siif himuufi` +
            `Galatoomi. Alfataawaa Afaan Oromoo ||Dr Jibriil Qamar||\n`,
        });
        if (result.ok) {
          fatwa.notifiedAt = new Date();
          await fatwa.save();
          emailStatus = 'sent';
        } else {
          emailStatus = 'failed';
        }
      }
    }

    return NextResponse.json({
      ok: true,
      number: fatwa.number,
      slug: fatwa.slug,
      status: fatwa.status,
      emailStatus,
    });
  } catch (error) {
    console.error('PUT /api/admin/fatwas/[id] failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}