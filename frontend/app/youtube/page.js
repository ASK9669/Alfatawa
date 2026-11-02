import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { connectDB } from '@/lib/db';
import Program from '@/models/Program';
import Episode from '@/models/Episode';

export const metadata = { title: 'YouTube programs' };

async function ProgramList() {
  await connection();
  await connectDB();

  const programs = await Program.find({ visible: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  const counts = await Episode.aggregate([
    { $match: { visible: true } },
    { $group: { _id: '$program', n: { $sum: 1 } } },
  ]);
  const countBy = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));

  if (programs.length === 0) {
    return <p className="text-muted">No programs yet.</p>;
  }

  return (
    <ul className="divide-y border-y">
      {programs.map((p) => (
        <li key={String(p._id)}>
          <Link href={`/youtube/${p.slug}`} className="block px-1 py-5 hover:bg-surface">
            <h2 className="text-xl font-semibold text-primary">{p.titleOromo}</h2>
            {p.descriptionOromo && (
              <p className="mt-1 line-clamp-2 text-muted">{p.descriptionOromo}</p>
            )}
            <p className="mt-2 text-sm text-muted">{countBy[String(p._id)] || 0} parts</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function YouTubePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">YouTube programs</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <ProgramList />
      </Suspense>
    </main>
  );
}