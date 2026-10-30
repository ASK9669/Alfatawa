import { Suspense } from 'react';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';

export const metadata = { title: 'Fatwas' };

async function FatwaBrowser({ searchParams }) {
  const { category: slug } = await searchParams;

  await connectDB();
  const categories = await Category.find().sort({ nameOromo: 1 }).lean();
  const current = categories.find((c) => c.slug === String(slug));

  const filter = { status: 'Published' };
  if (current) filter.category = current._id;

  const fatwas = await Fatwa.find(filter)
    .sort({ number: -1 })
    .select('number slug questionOromo category')
    .lean();

  const names = Object.fromEntries(categories.map((c) => [String(c._id), c.nameOromo]));

  const tab = 'rounded-full border px-3 py-1 text-sm';
  const active = 'rounded-full border border-black bg-black px-3 py-1 text-sm text-white';

  return (
    <>
      <nav className="mb-4 flex flex-wrap gap-2">
        <Link href="/fatwas" className={current ? tab : active}>All</Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/fatwas?category=${c.slug}`}
            className={current?.slug === c.slug ? active : tab}
          >
            {c.nameOromo}
          </Link>
        ))}
      </nav>

      {fatwas.length === 0 && <p>No fatwas in this category yet.</p>}

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