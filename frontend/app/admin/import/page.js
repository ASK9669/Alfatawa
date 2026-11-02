import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import ImportForm from './ImportForm';

async function Content() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        Back 
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Import fatwa</h1>
      <p className="mt-2 text-muted">
        Upload a text file (or paste the text) where every fatwa starts with a line like
        <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-sm">### | ibadaa</code>
        followed by <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-sm">Q:</code> for the question and
        <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-sm">A:</code> for the answer.
      </p>
      <ImportForm />
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