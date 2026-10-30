import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import LogoutButton from './LogoutButton';

function FatwaRow({ f }) {
  return (
    <li>
      <Link
        href={`/admin/fatwas/${String(f._id)}`}
        className="block rounded-lg border p-3 hover:bg-gray-50"
      >
        <span className="text-xs text-gray-500">
          {f.status}
          {f.number ? ` | Fatwa No. ${f.number}` : ''}
        </span>
        <p className="line-clamp-2">{f.titleOromo || f.questionOromo}</p>
      </Link>
    </li>
  );
}

async function Dashboard() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  await connectDB();
  const inbox = await Fatwa.find({ status: { $in: ['Pending', 'Draft'] } })
    .sort({ createdAt: -1 })
    .select('questionOromo titleOromo status number')
    .lean();
  const published = await Fatwa.find({ status: 'Published' })
    .sort({ number: -1 })
    .limit(20)
    .select('questionOromo titleOromo status number')
    .lean();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <LogoutButton />
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Inbox ({inbox.length})</h2>
        <ul className="space-y-2">
          {inbox.map((f) => <FatwaRow key={String(f._id)} f={f} />)}
        </ul>
        {inbox.length === 0 && <p>No pending questions.</p>}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Published (latest 20)</h2>
        <ul className="space-y-2">
          {published.map((f) => <FatwaRow key={String(f._id)} f={f} />)}
        </ul>
        {published.length === 0 && <p>Nothing published yet.</p>}
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-4">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}