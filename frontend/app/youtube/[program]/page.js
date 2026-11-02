import { cache, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { connectDB } from '@/lib/db';
import Program from '@/models/Program';
import Episode from '@/models/Episode';

const getProgram = cache(async (slug) => {
  await connection();
  await connectDB();
  const program = await Program.findOne({ slug, visible: true }).lean();
  if (!program) return null;
  const parts = await Episode.find({ program: program._id, visible: true })
    .sort({ number: 1 })
    .select('number titleOromo')
    .lean();
  return { program, parts };
});

export async function generateMetadata({ params }) {
  const { program: slug } = await params;
  const data = await getProgram(slug);
  if (!data) return { title: 'Not found', robots: { index: false } };
  const description = (data.program.descriptionOromo || '').slice(0, 160) || undefined;
  return { title: data.program.titleOromo, description };
}

async function Content({ params }) {
  const { program: slug } = await params;
  const data = await getProgram(slug);
  if (!data) notFound();
  const { program, parts } = data;

  return (
    <>
      <Link href="/youtube" className="text-sm font-medium text-primary hover:underline">
        All programs
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{program.titleOromo}</h1>
      {program.descriptionOromo && (
        <p className="mt-3 max-w-[65ch] whitespace-pre-line text-lg text-muted">
          {program.descriptionOromo}
        </p>
      )}

      {parts.length === 0 ? (
        <p className="mt-8 text-muted">No parts yet.</p>
      ) : (
        <ul className="mt-8 divide-y border-y">
          {parts.map((p) => (
            <li key={p.number}>
              <Link
                href={`/youtube/${program.slug}/${p.number}`}
                className="flex items-center gap-4 px-1 py-4 hover:bg-surface"
              >
                <span className="w-12 shrink-0 text-3xl font-semibold leading-none tabular-nums text-primary">
                  {p.number}
                </span>
                <span>{p.titleOromo}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ProgramPage({ params }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <Content params={params} />
      </Suspense>
    </main>
  );
}