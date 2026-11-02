'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function NewProgramForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    setBusy(true);
    setError('');

    const res = await fetch('/api/admin/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titleOromo: f.titleOromo.value,
        descriptionOromo: f.descriptionOromo.value,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push(`/admin/youtube/${data.id}`);
      router.refresh();
    } else {
      setError(data.error || 'Could not save.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5">
      <div>
        <label htmlFor="titleOromo" className={ui.label}>Program name</label>
        <input id="titleOromo" name="titleOromo" required maxLength={120} className={ui.input} />
      </div>
      <div>
        <label htmlFor="descriptionOromo" className={ui.label}>Description (optional)</label>
        <textarea id="descriptionOromo" name="descriptionOromo" rows={4} maxLength={2000} className={ui.input} />
      </div>
      {error && <p role="alert" className={ui.error}>{error}</p>}
      <button type="submit" disabled={busy} className={ui.primary}>
        {busy ? 'Saving...' : 'Create program'}
      </button>
    </form>
  );
}