import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import About from '@/models/About';
import AboutForm from './AboutForm';

async function Content() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  await connectDB();
  const a = await About.findOne({ key: 'sheikh' }).lean();

  const about = {
    nameOromo: a?.nameOromo || '',
    nameArabic: a?.nameArabic || '',
    photoUrl: a?.photoUrl || '',
    biographyOromo: a?.biographyOromo || '',
    biographyArabic: a?.biographyArabic || '',
    education: (a?.education || []).join('\n'),
    works: (a?.works || []).join('\n'),
    timeline: (a?.timeline || []).map((t) => `${t.year} | ${t.text}`).join('\n'),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        gara daashboordii
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Edit the About page</h1>
      <AboutForm about={about} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading...</p>}>
      <Content />
    </Suspense>
  );
}
