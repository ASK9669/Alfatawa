'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnswerForm({ fatwa, categories }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(fatwa);

  async function save(e, status) {
    const form = e.target.form;
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
    setMessage(
      data.status === 'Published'
        ? `Published as Fatwa No. ${data.number}.`
        : `Saved as ${data.status}.`
    );
    router.refresh();
  }

  return (
    <form className="space-y-4">
      <p className="text-sm text-gray-500">Status: {saved.status}</p>

      <div>
        <label htmlFor="questionOromo" className="mb-1 block font-semibold">Question</label>
        <textarea id="questionOromo" name="questionOromo" rows={4}
          defaultValue={fatwa.questionOromo} className="w-full rounded-lg border p-2" />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block font-semibold">Category</label>
        <select id="category" name="category" defaultValue={fatwa.category}
          className="w-full rounded-lg border p-2">
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nameOromo}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="answerOromo" className="mb-1 block font-semibold">Answer</label>
        <textarea id="answerOromo" name="answerOromo" rows={10}
          defaultValue={fatwa.answerOromo} className="w-full rounded-lg border p-2" />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="mb-1 block font-semibold">YouTube link (optional)</label>
        <input id="youtubeUrl" name="youtubeUrl" defaultValue={fatwa.youtubeUrl}
          className="w-full rounded-lg border p-2" />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}
      {saved.status === 'Published' && saved.slug && (
        <a href={`/fatwas/${saved.slug}`} className="underline" target="_blank" rel="noreferrer">
          View on the website
        </a>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={(e) => save(e, 'Draft')}
          className="rounded-lg border px-4 py-2 disabled:opacity-50">
          Save draft
        </button>
        <button type="button" disabled={busy} onClick={(e) => save(e, 'Published')}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50">
          Publish
        </button>
        <button type="button" disabled={busy}
          onClick={(e) => {
            if (confirm('Reject this question? It will not be published.')) save(e, 'Rejected');
          }}
          className="rounded-lg border border-red-600 px-4 py-2 text-red-600 disabled:opacity-50">
          Reject
        </button>
      </div>
    </form>
  );
}