'use client';

import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className={ui.secondary}>
      Log out
    </button>
  );
}
