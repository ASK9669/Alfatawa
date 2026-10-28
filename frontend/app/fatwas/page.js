import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Fatwas' };

export default async function FatwaListPage() {
  await connectDB();
  const fatwas = await Fatwa.find({ status: 'Published' })
    .sort({ number: -1 })
    .select('number slug titleOromo')
    .lean();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Fatwas</h1>
      <ul className="space-y-3">
        {fatwas.map((f) => (
          <li key={f.slug}>
            <Link
              href={`/fatwas/${f.slug}`}
              className="block rounded-lg border p-4 hover:bg-gray-50"
            >
              <span className="text-sm text-gray-500">Fatwa No. {f.number}</span>
              <h2 className="text-lg font-semibold">{f.titleOromo}</h2>
            </Link>
          </li>
        ))}
      </ul>
      {fatwas.length === 0 && <p>No fatwas yet.</p>}
    </main>
  );
}