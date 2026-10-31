'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = new FormData(e.target);

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
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">Email</label>
          <input id="email" name="email" type="email" required
            className="w-full rounded-lg border p-2" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-semibold">Password</label>
          <input id="password" name="password" type="password" required
            className="w-full rounded-lg border p-2" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={sending}
          className="rounded-lg bg-primary hover:bg-primary-strong px-4 py-2 text-white disabled:opacity-50">
          {sending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}