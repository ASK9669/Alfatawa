import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import YouTubeEmbed from '@/components/YouTubeEmbed';

async function FatwaContent({ params }) {
  const { slug } = await params;

  await connectDB();
  const fatwa = await Fatwa.findOne({ slug, status: 'Published' }).lean();
  if (!fatwa) notFound();

  return (
    <>
      <p className="text-sm text-gray-500">Fatwa No. {fatwa.number}</p>
      <h1 className="text-2xl font-bold">{fatwa.titleOromo}</h1>

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