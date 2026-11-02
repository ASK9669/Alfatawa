'use client';

import { useState } from 'react';
import { ui } from '@/lib/ui';

export default function AskPage() {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');
  const [length, setLength] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus('Ergamaa jira');
    setMessage('');
    const form = new FormData(formEl);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: form.get('question'),
          email: form.get('email'),
          notify: form.get('notify') === 'on',
          website: form.get('website'),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('done');
        formEl.reset();
        setLength(0);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not connect. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div role="status" className={ui.success}>
          Gaafiin milkaa'inaan ergameera. Galatoomaa.
        </div>
        <p className="mt-4 text-muted">
          Gaafiin ilaalame yeroo gabaabaa keessatti deebiin isaa ni maxxanafama.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className={`${ui.secondary} mt-6`}>
          Gaafiin biraa ergi
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Ask the Mufti</h1>
      <p className="mt-2 text-muted">Write your question clearly. You do not need to give your name.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="question" className={ui.label}>Your question</label>
          <textarea
            id="question"
            name="question"
            required
            minLength={5}
            maxLength={2000}
            rows={7}
            onChange={(e) => setLength(e.target.value.length)}
            className={ui.input}
          />
          <p className={`${ui.hint} text-end`}>{length} / 2000</p>
        </div>

        <div>
          <label htmlFor="email" className={ui.label}>Email (optional)</label>
          <input id="email" name="email" type="email" autoComplete="email" className={ui.input} />
          <p className={ui.hint}>you email is never shown on the website.</p>
        </div>

        <label className="flex items-start gap-3">
          <input type="checkbox" defaultChecked name="notify" className="mt-1.5 h-4 w-4 accent-primary" />
          <span>Deebiin isaa karaa Emailii tiin na haa qaqqabu</span>
        </label>

        {/* honeypot: hidden from people, bots fill it */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

        {status === 'error' && (
          <p role="alert" className={ui.error}>{message}</p>
        )}

        <button type="submit" disabled={status === 'sending'} className={ui.primary}>
          {status === 'sending' ? 'Sending...' : 'gaafii Ergi'}
        </button>
      </form>
    </main>
  );
}
