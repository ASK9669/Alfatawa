'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ui } from '@/lib/ui';

export default function ImportForm() {
  const [text, setText] = useState('');
  const [publish, setPublish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [check, setCheck] = useState(null);
  const [done, setDone] = useState(null);

  function reset() {
    setCheck(null);
    setDone(null);
    setError('');
  }

  async function readFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5000000) {
      setError('The file is larger than 5 MB.');
      return;
    }
    setText(await file.text());
    reset();
  }

  async function send(dryRun) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, publish, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setCheck(null);
      } else if (dryRun) {
        setCheck(data);
        setDone(null);
      } else {
        setDone(data);
        setCheck(null);
      }
    } catch {
      setError('Could not connect. Please try again.');
    }
    setBusy(false);
  }

  function runImport() {
    if (
      publish &&
      !confirm(`Publish ${check.ready} fatwas immediately? They will be visible to everyone.`)
    ) {
      return;
    }
    send(false);
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="file" className={ui.label}>Faayila filadhu</label>
        <input id="file" type="file" accept=".txt,text/plain" onChange={readFile} className={ui.input} />
      </div>

      <div>
        <label htmlFor="text" className={ui.label}>Faayila kee galchi</label>
        <textarea
          id="text"
          rows={12}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            reset();
          }}
          className={`${ui.input} font-mono text-sm`}
        />
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => {
            setPublish(e.target.checked);
            reset();
          }}
          className="mt-1.5 h-4 w-4 accent-primary"
        />
        <span>
          Kallattiidhaan Maxxansi.
          <span className="block text-sm text-muted">
          </span>
        </span>
      </label>

      <div aria-live="polite" className="space-y-3">
        {error && <p role="alert" className={ui.error}>{error}</p>}

        {check && (
          <div role="status" className="space-y-2 rounded-md border bg-surface p-4">
            <p className="font-semibold">
              Found {check.total} items. {check.ready} can be imported
              {check.errorCount > 0 ? `, ${check.errorCount} have problems.` : '.'}
            </p>
            {check.samples.length > 0 && (
              <ul className="list-disc ps-5 text-sm text-muted">
                {check.samples.map((s, i) => (
                  <li key={i}>
                    {s.number ? `No. ${s.number}: ` : ''}
                    {s.question}
                  </li>
                ))}
              </ul>
            )}
            {check.errors.length > 0 && (
              <ul className="list-disc ps-5 text-sm text-red-800">
                {check.errors.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            )}
            {check.errorCount > check.errors.length && (
              <p className="text-sm text-muted">Only the first {check.errors.length} problems are shown.</p>
            )}
          </div>
        )}

        {done && (
          <div role="status" className={ui.success}>
            Fatwaan  {done.created} milkaa'inaan maxxanfameera
            {done.errorCount > 0 ? `, ${done.errorCount} were skipped.` : '.'}{' '}
            <Link href="/admin" className="underline">Banii ilaali</Link>
          </div>
        )}
        {done && done.errors.length > 0 && (
          <ul className="list-disc ps-5 text-sm text-red-800">
            {done.errors.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <button
          type="button"
          disabled={busy || !text.trim()}
          onClick={() => send(true)}
          className={ui.secondary}
        >
          {busy ? 'Working...' : 'Check'}
        </button>
        <button
          type="button"
          disabled={busy || !check || check.ready === 0}
          onClick={runImport}
          className={ui.primary}
        >
          Maxxansi
        </button>
      </div>
    </div>
  );
}