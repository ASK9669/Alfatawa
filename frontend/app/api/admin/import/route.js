import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';
import { parseImport, MAX_ITEMS } from '@/lib/importParser';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';
import Counter from '@/models/Counter';

const norm = (s) => String(s).toLowerCase().replace(/[’‘ʼ`´']/g, '').trim();

export async function POST(request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const text = String(body.text || '');
    const dryRun = body.dryRun !== false; // safe by default: check only
    const publish = body.publish === true;

    if (text.length > 5000000) {
      return NextResponse.json({ error: 'The text is larger than 5 MB.' }, { status: 413 });
    }

    const parsed = parseImport(text);
    if (parsed.total === 0) {
      return NextResponse.json(
        { error: 'No fatwas found. Each one must start with a line like: ### 12 | Category' },
        { status: 400 }
      );
    }
    if (parsed.total > MAX_ITEMS) {
      return NextResponse.json(
        { error: `Too many items. Import at most ${MAX_ITEMS} at a time.` },
        { status: 400 }
      );
    }

    await connectDB();

    const categories = await Category.find().lean();
    const byName = new Map();
    for (const c of categories) {
      byName.set(norm(c.nameOromo), c._id);
      byName.set(norm(c.slug), c._id);
    }

    const numbers = parsed.items.filter((i) => i.number).map((i) => i.number);
    const takenNumbers = new Set(
      numbers.length
        ? (await Fatwa.find({ number: { $in: numbers } }).select('number').lean()).map((f) => f.number)
        : []
    );
    const takenQuestions = new Set(
      (
        await Fatwa.find({ questionOromo: { $in: parsed.items.map((i) => i.question) } })
          .select('questionOromo')
          .lean()
      ).map((f) => f.questionOromo)
    );

    const errors = [...parsed.errors];
    const ready = [];

    for (const item of parsed.items) {
      const label = `Item at line ${item.line}`;
      let category;
      if (item.categoryName) {
        category = byName.get(norm(item.categoryName));
        if (!category) {
          errors.push(`${label}: the category “${item.categoryName}” does not exist.`);
          continue;
        }
      }
      if (item.number && takenNumbers.has(item.number)) {
        errors.push(`${label}: number ${item.number} is already used.`);
        continue;
      }
      if (takenQuestions.has(item.question)) {
        errors.push(`${label}: this question already exists.`);
        continue;
      }
      if (publish && !category) {
        errors.push(`${label}: a category is needed to publish.`);
        continue;
      }
      if (publish && !item.answer) {
        errors.push(`${label}: an answer is needed to publish.`);
        continue;
      }
      ready.push({ ...item, category });
    }

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        total: parsed.total,
        ready: ready.length,
        errorCount: errors.length,
        errors: errors.slice(0, 50),
        samples: ready.slice(0, 3).map((i) => ({
          number: i.number,
          question: i.question.slice(0, 120),
        })),
      });
    }

    // move the counter ahead of every number we are about to use
    const maxNumber = Math.max(0, ...ready.filter((i) => i.number).map((i) => i.number));
    if (maxNumber > 0) {
      await Counter.findOneAndUpdate(
        { _id: 'fatwa' },
        { $max: { seq: maxNumber } },
        { upsert: true }
      );
    }

    let created = 0;
    for (const item of ready) {
      try {
        let number = item.number || undefined;
        if (publish && !number) {
          const counter = await Counter.findOneAndUpdate(
            { _id: 'fatwa' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          number = counter.seq;
        }
        await Fatwa.create({
          questionOromo: item.question,
          answerOromo: item.answer || undefined,
          youtubeUrl: item.youtubeUrl || undefined,
          category: item.category,
          number,
          slug: publish && number ? `fatwa-${number}` : undefined,
          status: publish ? 'Published' : 'Draft',
          publishedAt: publish ? new Date() : undefined,
        });
        created += 1;
      } catch (error) {
        errors.push(
          `Item at line ${item.line}: could not be saved (${
            error.code === 11000 ? 'the number already exists' : 'unexpected error'
          }).`
        );
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun: false,
      created,
      errorCount: errors.length,
      errors: errors.slice(0, 50),
    });
  } catch (error) {
    console.error('POST /api/admin/import failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}