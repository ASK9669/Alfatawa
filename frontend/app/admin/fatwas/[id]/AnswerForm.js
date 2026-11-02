'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function AnswerForm({ fatwa, categories }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(fatwa);

  async function save(e, status) {
    const form = e.currentTarget.form;
    setBusy(true);
    setError('');
    setMessage('');

    const res = await fetch(`/api/admin/fatwas/${fatwa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        questionOromo: form.questionOromo.value,
        category: form.category.value,
        answerOromo: form.answerOromo.value,
        youtubeUrl: form.youtubeUrl.value,
      }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || 'Could not save.');
      return;
    }
    setSaved({ ...saved, status: data.status, number: data.number, slug: data.slug });

    let text =
      data.status === 'Published'
        ? `Published as Fatwa No. ${data.number}.`
        : `Saved as ${data.status}.`;
    if (data.emailStatus === 'sent') text += ' The asker was notified by email.';
    if (data.emailStatus === 'failed') {
      text += ' The email to the asker could not be sent. Click Publish again to retry.';
    }
    setMessage(text);
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-6">
      <p className="text-sm text-muted">
        Status: <span className="font-semibold text-ink">{saved.status}</span>
      </p>

      <div>
        <label htmlFor="questionOromo" className={ui.label}>Question</label>
        <textarea id="questionOromo" name="questionOromo" rows={4}
          defaultValue={fatwa.questionOromo} className={ui.input} />
      </div>

      <div>
        <label htmlFor="category" className={ui.label}>Category</label>
        <select id="category" name="category" defaultValue={fatwa.category} className={ui.input}>
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nameOromo}</option>
          ))}
        </select>
        <p className={ui.hint}>tokko filachuun dirqama.</p>
      </div>

      <div>
        <label htmlFor="answerOromo" className={ui.label}>Deebii</label>
        <textarea id="answerOromo" name="answerOromo" rows={12}
          defaultValue={fatwa.answerOromo} className={`${ui.input} leading-7`} />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className={ui.label}>YouTube link (optional)</label>
        <input id="youtubeUrl" name="youtubeUrl" defaultValue={fatwa.youtubeUrl} className={ui.input} />
      </div>

      <div aria-live="polite" className="space-y-3">
        {error && <p role="alert" className={ui.error}>{error}</p>}
        {message && <p role="status" className={ui.success}>{message}</p>}
        {saved.status === 'Published' && saved.slug && (
          <a href={`/fatwas/${saved.slug}`} target="_blank" rel="noreferrer"
            className="inline-block text-sm font-medium text-primary underline">
          Weebsaayitii irratti Ilaali
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <button type="button" disabled={busy} onClick={(e) => save(e, 'Published')} className={ui.primary}>
          Maxxansi
        </button>
        <button type="button" disabled={busy} onClick={(e) => save(e, 'Draft')} className={ui.secondary}>
          yeroof kaayi
        </button>
        <button type="button" disabled={busy}
          onClick={(e) => {
            if (confirm('Reject this question? It will not be published.')) save(e, 'Rejected');
          }}
          className={`${ui.danger} sm:ms-auto`}>
          Haqi
        </button>
      </div>
    </form>
  );
}
