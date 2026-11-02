'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function NewFatwaForm({ categories }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [draftId, setDraftId] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e, publish) {
    const form = e.currentTarget.form;
    const payload = {
      questionOromo: form.questionOromo.value,
      category: form.category.value,
      answerOromo: form.answerOromo.value,
      youtubeUrl: form.youtubeUrl.value,
    };
    setBusy(true);
    setError('');
    setDraftId('');

    const res = await fetch('/api/admin/fatwas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    if (!res.ok) {
      setError(created.error || 'Could not save.');
      setBusy(false);
      return;
    }

    if (publish) {
      const pub = await fetch(`/api/admin/fatwas/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, status: 'Published' }),
      });
      const data = await pub.json();
      if (!pub.ok) {
        setError(`${data.error || 'Could not publish.'} The draft was saved.`);
        setDraftId(created.id);
        setBusy(false);
        return;
      }
    }

    router.push(`/admin/fatwas/${created.id}`);
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-6">
      <div>
        <label htmlFor="questionOromo" className={ui.label}>Gaafi</label>
        <textarea id="questionOromo" name="questionOromo" rows={5} maxLength={2000} className={ui.input} />
      </div>

      <div>
        <label htmlFor="category" className={ui.label}>Qoodama</label>
        <select id="category" name="category" defaultValue="" className={ui.input}>
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nameOromo}</option>
          ))}
        </select>
        <p className={ui.hint}>Tokko filachuun Dirqama </p>
      </div>

      <div>
        <label htmlFor="answerOromo" className={ui.label}>Deebii</label>
        <textarea id="answerOromo" name="answerOromo" rows={12} className={`${ui.input} leading-7`} />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className={ui.label}>YouTube link (optional)</label>
        <input id="youtubeUrl" name="youtubeUrl" className={ui.input} />
      </div>

      <div aria-live="polite" className="space-y-3">
        {error && <p role="alert" className={ui.error}>{error}</p>}
        {draftId && (
          <Link href={`/admin/fatwas/${draftId}`} className="inline-block text-sm font-medium text-primary underline">
            Draft
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <button type="button" disabled={busy} onClick={(e) => submit(e, true)} className={ui.primary}>
          {busy ? 'Saving...' : 'Publish'}
        </button>
        <button type="button" disabled={busy} onClick={(e) => submit(e, false)} className={ui.secondary}>
          yeroof kaayi
        </button>
      </div>
    </form>
  );
}