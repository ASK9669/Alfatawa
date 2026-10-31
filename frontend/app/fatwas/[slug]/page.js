import { cache, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import FatwaNumber from '@/components/FatwaNumber';

// cache() lets the page and its metadata share one database query
const getFatwa = cache(async (slug) => {
  await connection();
  await connectDB();
  return Fatwa.findOne({ slug, status: 'Published' })
    .populate('category', 'nameOromo slug')
    .lean();
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fatwa = await getFatwa(slug);

  if (!fatwa) {
    return { title: 'Not found', robots: { index: false } };
  }

  const title = `Fatwa No. ${fatwa.number}`;
  const text = fatwa.questionOromo.replace(/\s+/g, ' ').trim();
  const description = text.length > 160 ? `${text.slice(0, 157)}...` : text;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

async function FatwaContent({ params }) {
  const { slug } = await params;
  const fatwa = await getFatwa(slug);
  if (!fatwa) notFound();

  return (
    <article>
      <Link href="/fatwas" className="text-sm font-medium text-primary hover:underline">
        Back to all fatwas
      </Link>

      <header className="mt-5 border-b pb-6">
        <h1 className="sr-only">Fatwa No. {fatwa.number}</h1>
        <FatwaNumber number={fatwa.number} large />
        <p className="mt-3 text-sm text-muted">
          {fatwa.category && (
            <Link
              href={`/fatwas?category=${fatwa.category.slug}`}
              className="font-medium text-primary hover:underline"
            >
              {fatwa.category.nameOromo}
            </Link>
          )}
          {fatwa.category && fatwa.publishedAt && ' | '}
          {fatwa.publishedAt && (
            <time dateTime={new Date(fatwa.publishedAt).toISOString()}>
              {formatDate(fatwa.publishedAt)}
            </time>
          )}
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-muted">Question</h2>
        <blockquote className="mt-2 max-w-[65ch] border-s-4 border-primary ps-4 text-lg">
          <p className="whitespace-pre-line">{fatwa.questionOromo}</p>
        </blockquote>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-muted">Answer</h2>
        <div className="mt-2 max-w-[65ch] whitespace-pre-line text-lg leading-8">
          {fatwa.answerOromo}
        </div>
      </section>

      {fatwa.youtubeUrl && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-muted">Watch the program</h2>
          <YouTubeEmbed url={fatwa.youtubeUrl} />
        </section>
      )}
    </article>
  );
}

export default function FatwaPage({ params }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <FatwaContent params={params} />
      </Suspense>
    </main>
  );
}