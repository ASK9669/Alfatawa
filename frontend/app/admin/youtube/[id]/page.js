import { Suspense } from 'react';
import Link from 'next/link';
import mongoose from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Program from '@/models/Program';
import Episode from '@/models/Episode';
import EpisodesManager from './EpisodesManager';

async function Content({ params }) {
  const { id } = await params;

  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const program = await Program.findById(id).lean();
  if (!program) notFound();

  const docs = await Episode.find({ program: id }).sort({ number: 1 }).lean();
  const episodes = docs.map((e) => ({
    id: String(e._id),
    number: e.number,
    title: e.titleOromo,
    youtubeId: e.youtubeId,
  }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin/youtube" className="text-sm font-medium text-primary hover:underline">
        All programs
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{program.titleOromo}</h1>
      <p className="mt-2 text-sm">
        <a href={`/youtube/${program.slug}`} target="_blank" rel="noreferrer" className="text-primary underline">
          View on the website
        </a>
      </p>
      <EpisodesManager programId={String(program._id)} episodes={episodes} />
    </main>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading...</p>}>
      <Content params={params} />
    </Suspense>
  );
}