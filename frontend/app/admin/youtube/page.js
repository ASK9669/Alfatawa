import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Program from '@/models/Program';
import Episode from '@/models/Episode';
import NewProgramForm from './NewProgramForm';

async function Content() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  await connectDB();
  const programs = await Program.find().sort({ order: 1, createdAt: 1 }).lean();
  const counts = await Episode.aggregate([{ $group: { _id: '$program', n: { $sum: 1 } } }]);
  const countBy = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">YouTube programs</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Programs ({programs.length})</h2>
        {programs.length === 0 ? (
          <p className="mt-3 text-muted">No programs yet. Create the first one below.</p>
        ) : (
          <ul className="mt-3 divide-y border-y">
            {programs.map((p) => (
              <li key={String(p._id)}>
                <Link
                  href={`/admin/youtube/${String(p._id)}`}
                  className="flex items-center justify-between gap-4 px-1 py-4 hover:bg-surface"
                >
                  <span className="font-medium">{p.titleOromo}</span>
                  <span className="text-sm text-muted">{countBy[String(p._id)] || 0} parts</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">New program</h2>
        <NewProgramForm />
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading...</p>}>
      <Content />
    </Suspense>
  );
}