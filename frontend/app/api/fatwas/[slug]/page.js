import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import Category from '@/models/Category';
import YouTubeEmbed from '@/components/YouTubeEmbed';

// cache() makes the page and its metadata share one database query
const getFatwa = cache(async (slug) => {
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

async function FatwaContent({ params }) {
  const { slug } = await params;
  const fatwa = await getFatwa(slug);
  if (!fatwa) notFound();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Fatwa No. {fatwa.number}</h1>
        {fatwa.category && (
          <p className="text-sm text-gray-500">{fatwa.category.nameOromo}</p>
        )}
      </div>

      <section>
        <h2 className="mb-1 font-semibold">Question</h2>
        <p className="whitespace-pre-line">{fatwa.questionOromo}</p>
      </section>

      <section>
        <h2 className="mb-1 font-semibold">Answer</h2>
        <p className="whitespace-pre-line">{fatwa.answerOromo}</p>
      </section>

      <YouTubeEmbed url={fatwa.youtubeUrl} />
    </>
  );
}

export default function FatwaPage({ params }) {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <FatwaContent params={params} />
      </Suspense>
    </main>
  );
}