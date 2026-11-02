'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ui } from '@/lib/ui';

export default function EpisodesManager({ programId, episodes }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function addParts(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const res = await fetch(`/api/admin/programs/${programId}/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setBusy(false);

    if (res.ok) {
      setMessage(`Added ${data.added} parts.`);
      setText('');
      router.refresh();
    } else {
      setError(data.error || 'Could not save.');
    }
  }

  async function remove(id, number) {
    if (!confirm(`Delete part ${number}? This cannot be undone.`)) return;
    setError('');
    const res = await fetch(`/api/admin/episodes/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
    else setError('Could not delete.');
  }

  return (
    <div className="mt-8 space-y-10">
      <section>
        <h2 className="text-lg font-semibold">Parts ({episodes.length})</h2>
        {episodes.length === 0 ? (
          <p className="mt-3 text-muted">No parts yet. Add them below.</p>
        ) : (
          <ul className="mt-3 divide-y border-y">
            {episodes.map((ep) => (
              <li key={ep.id} className="flex items-center gap-4 py-3">
                <span className="w-10 shrink-0 tabular-nums font-semibold text-primary">{ep.number}</span>
                <span className="min-w-0 flex-1">
                  {ep.title}
                  <span className="block text-xs text-muted">{ep.youtubeId}</span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(ep.id, ep.number)}
                  className="rounded-md border border-red-700 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Add parts</h2>
        <p className="mt-2 text-sm text-muted">
          Paste one YouTube link per line. The parts are numbered in the order of the lines, after the
          last existing part. To give a part its own name, write it first, then a | sign, then the link:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border bg-surface p-3 text-sm">
{`https://www.youtube.com/watch?v=XXXXXXXXXXX
My own name | https://youtu.be/YYYYYYYYYYY`}
        </pre>

        <form onSubmit={addParts} className="mt-4 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            aria-label="YouTube links"
            className={`${ui.input} font-mono text-sm`}
          />
          <div aria-live="polite" className="space-y-3">
            {error && <p role="alert" className={ui.error}>{error}</p>}
            {message && <p role="status" className={ui.success}>{message}</p>}
          </div>
          <button type="submit" disabled={busy || !text.trim()} className={ui.primary}>
            {busy ? 'Adding...' : 'Add parts'}
          </button>
        </form>
      </section>
    </div>
  );
}