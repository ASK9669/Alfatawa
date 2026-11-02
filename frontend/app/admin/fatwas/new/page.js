import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import NewFatwaForm from './NewFatwaForm';

async function Content() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  await connectDB();
  const docs = await Category.find().sort({ nameOromo: 1 }).lean();
  const categories = docs.map((c) => ({ id: String(c._id), nameOromo: c.nameOromo }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        Back
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Fatwaa Haaraa</h1>
      <p className="mt-2 text-muted">
        Gaafi keetiifi Deebii isaa barreessi.
      </p>
      <NewFatwaForm categories={categories} />
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