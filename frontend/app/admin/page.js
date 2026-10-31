import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import LogoutButton from './LogoutButton';

const BADGE = {
  Pending: 'border-accent text-accent',
  Draft: 'text-muted',
  Published: 'border-primary text-primary',
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function FatwaRow({ f }) {
  return (
    <li>
      <Link
        href={`/admin/fatwas/${String(f._id)}`}
        className="block px-1 py-4 hover:bg-surface"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE[f.status] || ''}`}>
            {f.status}
          </span>
          {f.number && <span className="font-semibold text-primary">No. {f.number}</span>}
          <span className="text-muted">{formatDate(f.createdAt)}</span>
        </div>
        <p className="mt-1.5 line-clamp-2">{f.questionOromo}</p>
      </Link>
    </li>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <p className="text-3xl font-semibold tabular-nums text-primary">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

async function Dashboard() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  await connectDB();
  const [pending, drafts, publishedCount] = await Promise.all([
    Fatwa.countDocuments({ status: 'Pending' }),
    Fatwa.countDocuments({ status: 'Draft' }),
    Fatwa.countDocuments({ status: 'Published' }),
  ]);

  const inbox = await Fatwa.find({ status: { $in: ['Pending', 'Draft'] } })
    .sort({ createdAt: -1 })
    .select('questionOromo status number createdAt')
    .lean();
  const published = await Fatwa.find({ status: 'Published' })
    .sort({ number: -1 })
    .limit(20)
    .select('questionOromo status number createdAt')
    .lean();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <LogoutButton />
      </div>

      <nav aria-label="Admin links" className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <Link href="/admin/about" className="font-medium text-primary hover:underline">
          Edit the About page
        </Link>
        <Link href="/" className="font-medium text-primary hover:underline">
          View the website
        </Link>
                <Link href="/admin/fatwas/new" className="font-medium text-primary hover:underline">
          New fatwa
        </Link>
        <Link href="/admin/import" className="font-medium text-primary hover:underline">
          Import fatwas
        </Link>
      </nav>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Waiting" value={pending} />
        <Stat label="Drafts" value={drafts} />
        <Stat label="Published" value={publishedCount} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Inbox ({inbox.length})</h2>
        {inbox.length === 0 ? (
          <p className="mt-3 text-muted">No questions are waiting.</p>
        ) : (
          <ul className="mt-3 divide-y border-y">
            {inbox.map((f) => <FatwaRow key={String(f._id)} f={f} />)}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Latest published</h2>
        {published.length === 0 ? (
          <p className="mt-3 text-muted">Nothing is published yet.</p>
        ) : (
          <ul className="mt-3 divide-y border-y">
            {published.map((f) => <FatwaRow key={String(f._id)} f={f} />)}
          </ul>
        )}
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
