'use client';

import { useState } from 'react';

export default function AskPage() {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.target);

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
        e.target.reset();
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
      <main className="mx-auto max-w-xl p-4">
        <p className="rounded-lg border p-4">
          Your question was sent. Thank you.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Ask the Mufti</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="mb-1 block font-semibold">
            Your question
          </label>
          <textarea
            id="question"
            name="question"
            required
            minLength={5}
            maxLength={2000}
            rows={6}
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border p-2"
          />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="notify" />
          Notify me by email when my question is answered
        </label>

        {/* honeypot: hidden from people, bots fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        {status === 'error' && <p className="text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : 'Send question'}
        </button>
      </form>
    </main>
  );
}