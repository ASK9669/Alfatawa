import { cache, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { connectDB } from '@/lib/db';
import Program from '@/models/Program';
import Episode from '@/models/Episode';
import YouTubeEmbed from '@/components/YouTubeEmbed';

const getData = cache(async (slug, numberText) => {
  await connection();
  await connectDB();

  const number = Number.parseInt(numberText, 10);
  if (!Number.isSafeInteger(number) || number < 1) return null;

  const program = await Program.findOne({ slug, visible: true }).lean();
  if (!program) return null;

  const parts = await Episode.find({ program: program._id, visible: true })
    .sort({ number: 1 })
    .select('number titleOromo youtubeId')
    .lean();
  const index = parts.findIndex((p) => p.number === number);
  if (index === -1) return null;

  return {
    program,
    parts,
    current: parts[index],
    prev: parts[index - 1] || null,
    next: parts[index + 1] || null,
  };
});

export async function generateMetadata({ params }) {
  const { program: slug, number } = await params;
  const data = await getData(slug, number);
  if (!data) return { title: 'Not found', robots: { index: false } };
  return { title: `${data.program.titleOromo}: ${data.current.titleOromo}` };
}

async function Content({ params }) {
  const { program: slug, number } = await params;
  const data = await getData(slug, number);
  if (!data) notFound();
  const { program, parts, current, prev, next } = data;

  const pager = 'rounded-md border bg-surface px-4 py-2.5 text-sm font-medium hover:border-primary';

  return (
    <>
      <Link
        href={`/youtube/${program.slug}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        {program.titleOromo}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{current.titleOromo}</h1>
      <p className="mt-1 text-sm text-muted">
        Part {current.number} of {parts.length}
      </p>

      <div className="mt-6">
        <YouTubeEmbed url={`https://www.youtube.com/watch?v=${current.youtubeId}`} />
        <p className="mt-3 text-sm">
          <a
            href={`https://www.youtube.com/watch?v=${current.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            Watch on YouTube
          </a>
        </p>
      </div>

      <nav aria-label="Parts" className="mt-6 flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/youtube/${program.slug}/${prev.number}`} className={pager}>
            Previous part
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/youtube/${program.slug}/${next.number}`} className={pager}>
            Next part
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">All parts</h2>
        <ul className="mt-3 divide-y border-y">
          {parts.map((p) => (
            <li key={p.number}>
              <Link
                href={`/youtube/${program.slug}/${p.number}`}
                aria-current={p.number === current.number ? 'page' : undefined}
                className={`flex items-center gap-4 px-1 py-3 hover:bg-surface ${
                  p.number === current.number ? 'font-semibold text-primary' : ''
                }`}
              >
                <span className="w-10 shrink-0 tabular-nums">{p.number}</span>
                <span>{p.titleOromo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function EpisodePage({ params }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <Content params={params} />
      </Suspense>
    </main>
  );
}