'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(data.error || 'Login failed.');
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-12 border">
      <div className="rounded-lg border bg-surface p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Qofaafi</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className={ui.label}>Email</label>
            <input id="email" placeholder="email kee galchi" name="email" type="email" required autoComplete="username" className={ui.input} />
          </div>
          <div>
            <label htmlFor="password" className={ui.label}>Password</label>
            <input id="password" placeholder="password galchi" name="password" type="password" required autoComplete="current-password" className={ui.input} />
          </div>
          {error && <p role="alert" className={ui.error}>{error}</p>}
          <button type="submit" disabled={sending} className={`${ui.primary} w-full`}>
            {sending ? 'Seenaa jira...' : 'Seeni'}
          </button>
        </form>
      </div>
    </main>
  );
}
