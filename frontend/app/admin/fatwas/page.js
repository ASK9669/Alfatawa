import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';

const PAGE_SIZE = 20;
const STATUSES = ['Pending', 'Draft', 'Published', 'Rejected'];
const APOSTROPHES = /[’‘ʼ`´]/g;

const BADGE = {
  Pending: 'border-accent text-accent',
  Draft: 'text-muted',
  Published: 'border-primary text-primary',
  Rejected: 'border-red-700 text-red-700',
};

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function buildSearch(q) {
  const clean = q.replace(APOSTROPHES, "'").trim().slice(0, 100);
  if (!clean) return null;

  const pattern = clean
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/'/g, "['’‘ʼ`´]");
  const rx = new RegExp(pattern, 'i');

  const or = [{ questionOromo: rx }, { answerOromo: rx }];
  if (/^\d{1,9}$/.test(clean)) or.push({ number: Number(clean) });
  return { $or: or };
}

function listLink(status, q, page) {
  const p = new URLSearchParams();
  if (status) p.set('status', status);
  if (q) p.set('q', q);
  if (page && page > 1) p.set('page', String(page));
  const s = p.toString();
  return s ? `/admin/fatwas?${s}` : '/admin/fatwas';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

async function List({ searchParams }) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  const params = await searchParams;
  const rawStatus = String(first(params.status) || '');
  const status = STATUSES.includes(rawStatus) ? rawStatus : '';
  const q = String(first(params.q) || '').slice(0, 100);
  const requestedPage = Math.min(
    Math.max(Number.parseInt(String(first(params.page) || '1'), 10) || 1, 1),
    100000
  );

  await connectDB();

  const filter = {};
  if (status) filter.status = status;
  const search = buildSearch(q);
  if (search) Object.assign(filter, search);

  const total = await Fatwa.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const fatwas = await Fatwa.find(filter)
    .sort(status === 'Published' ? { number: -1 } : { createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select('questionOromo status number createdAt')
    .lean();

  const chip = 'rounded-md border bg-surface px-3 py-2 text-sm hover:border-primary';
  const chipActive = 'rounded-md border border-primary bg-primary px-3 py-2 text-sm text-white';
  const pager = 'rounded-md border bg-surface px-4 py-2.5 text-sm font-medium hover:border-primary';

  return (
    <>
      <form action="/admin/fatwas" method="get" role="search" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          maxLength={100}
          aria-label="Search fatwas"
          placeholder="Search by word or fatwa number"
          className="min-w-0 flex-1 rounded-md border bg-surface px-3 py-2.5"
        />
        {status && <input type="hidden" name="status" value={status} />}
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-strong"
        >
          Search
        </button>
      </form>

      <nav aria-label="Status" className="mt-4 flex flex-wrap gap-2">
        <Link href={listLink('', q)} className={status ? chip : chipActive}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={listLink(s, q)} className={status === s ? chipActive : chip}>
            {s}
          </Link>
        ))}
      </nav>

      <p className="mt-5 text-sm text-muted">
        {total} {total === 1 ? 'fatwa' : 'fatwas'}
        {q ? ` for “${q}”` : ''}.{' '}
        {q && (
          <Link href={listLink(status, '')} className="text-primary underline">
            Clear search
          </Link>
        )}
      </p>

      {fatwas.length === 0 ? (
        <p className="mt-6 text-muted">Nothing found.</p>
      ) : (
        <ul className="mt-4 divide-y border-y">
          {fatwas.map((f) => (
            <li key={String(f._id)}>
              <Link
                href={`/admin/fatwas/${String(f._id)}`}
                className="block px-1 py-4 hover:bg-surface"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE[f.status] || ''}`}
                  >
                    {f.status}
                  </span>
                  {f.number && <span className="font-semibold text-primary">No. {f.number}</span>}
                  <span className="text-muted">{formatDate(f.createdAt)}</span>
                </div>
                <p className="mt-1.5 line-clamp-2">{f.questionOromo}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between gap-3" aria-label="Pages">
          {page > 1 ? (
            <Link href={listLink(status, q, page - 1)} className={pager}>Previous</Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={listLink(status, q, page + 1)} className={pager}>Next</Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function AllFatwasPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        Back to dashboard
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-semibold tracking-tight">All fatwas</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <List searchParams={searchParams} />
      </Suspense>
    </main>
  );
}