import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import LogoutButton from './LogoutButton';

async function Dashboard() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <p>You are signed in as: {admin.role}</p>
      <LogoutButton />
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-4">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}