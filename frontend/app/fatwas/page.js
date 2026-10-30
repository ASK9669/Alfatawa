import { Suspense } from 'react';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';

export const metadata = { title: 'Fatwas' };

const PAGE_SIZE = 10;
const APOSTROPHES = /[’‘ʼ`´]/g;

function buildSearchFilter(q) {
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

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function listLink(categorySlug, q, page) {
  const p = new URLSearchParams();
  if (categorySlug) p.set('category', categorySlug);
  if (q) p.set('q', q);
  if (page && page > 1) p.set('page', String(page));
  const s = p.toString();
  return s ? `/fatwas?${s}` : '/fatwas';
}

async function FatwaBrowser({ searchParams }) {
  const params = await searchParams;
  const slug = String(first(params.category) || '');
  const q = String(first(params.q) || '').slice(0, 100);
  const requestedPage = Math.min(
    Math.max(Number.parseInt(String(first(params.page) || '1'), 10) || 1, 1),
    100000
  );

  await connectDB();
  const categories = await Category.find().sort({ nameOromo: 1 }).lean();
  const current = categories.find((c) => c.slug === slug);

  const filter = { status: 'Published' };
  if (current) filter.category = current._id;
  const search = buildSearchFilter(q);
  if (search) Object.assign(filter, search);

  const total = await Fatwa.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const fatwas = await Fatwa.find(filter)
    .sort({ number: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select('number slug questionOromo category')
    .lean();

  const names = Object.fromEntries(categories.map((c) => [String(c._id), c.nameOromo]));

  const tab = 'rounded-full border px-3 py-1 text-sm';
  const active = 'rounded-full border border-black bg-black px-3 py-1 text-sm text-white';
  const pageLink = 'rounded-lg border px-4 py-2 text-sm hover:bg-gray-50';

  return (
    <>
      <form action="/fatwas" method="get" className="mb-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          maxLength={100}
          placeholder="Search by word or fatwa number"
          className="flex-1 rounded-lg border p-2"
        />
        {current && <input type="hidden" name="category" value={current.slug} />}
        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
          Search
        </button>
      </form>

      <nav className="mb-4 flex flex-wrap gap-2">
        <Link href={listLink('', q)} className={current ? tab : active}>All</Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={listLink(c.slug, q)}
            className={current?.slug === c.slug ? active : tab}
          >
            {c.nameOromo}
          </Link>
        ))}
      </nav>

      {q && (
        <p className="mb-3 text-sm text-gray-600">
          {total} result(s) for “{q}”{' '}
          <Link href={listLink(current?.slug, '')} className="underline">Clear</Link>
        </p>
      )}

      {fatwas.length === 0 && (
        <p>{q ? 'No fatwas found.' : 'No fatwas in this category yet.'}</p>
      )}

      <ul className="space-y-3">
        {fatwas.map((f) => (
          <li key={String(f._id)}>
            <Link
              href={`/fatwas/${f.slug}`}
              className="block rounded-lg border p-4 hover:bg-gray-50"
            >
              <span className="text-sm text-gray-500">
                Fatwa No. {f.number}
                {f.category && names[String(f.category)] ? ` | ${names[String(f.category)]}` : ''}
              </span>
              <p className="mt-1 line-clamp-3 whitespace-pre-line">{f.questionOromo}</p>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between" aria-label="Pages">
          {page > 1 ? (
            <Link href={listLink(current?.slug, q, page - 1)} className={pageLink}>
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={listLink(current?.slug, q, page + 1)} className={pageLink}>
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function FatwaListPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Fatwas</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FatwaBrowser searchParams={searchParams} />
      </Suspense>
    </main>
  );
}