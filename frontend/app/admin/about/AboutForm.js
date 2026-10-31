'use client';

import { useState } from 'react';

export default function AboutForm({ about }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    const f = e.target;

    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nameOromo: f.nameOromo.value,
        nameArabic: f.nameArabic.value,
        photoUrl: f.photoUrl.value,
        biographyOromo: f.biographyOromo.value,
        biographyArabic: f.biographyArabic.value,
        education: f.education.value,
        works: f.works.value,
        timeline: f.timeline.value,
      }),
    });
    const data = await res.json();
    setBusy(false);

    if (res.ok) setMessage('Saved.');
    else setError(data.error || 'Could not save.');
  }

  const input = 'w-full rounded-lg border p-2';
  const label = 'mb-1 block font-semibold';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nameOromo" className={label}>Name (Afaan Oromoo)</label>
        <input id="nameOromo" name="nameOromo" defaultValue={about.nameOromo} className={input} />
      </div>

      <div>
        <label htmlFor="nameArabic" className={label}>Name (Arabic)</label>
        <input id="nameArabic" name="nameArabic" dir="rtl" defaultValue={about.nameArabic} className={input} />
      </div>

      <div>
        <label htmlFor="photoUrl" className={label}>Photo</label>
        <input id="photoUrl" name="photoUrl" defaultValue={about.photoUrl}
          placeholder="/sheikh.jpg" className={input} />
        <p className="mt-1 text-sm text-muted">
          Put the image file in the project&apos;s public folder and write its name here, or use an https:// address.
        </p>
      </div>

      <div>
        <label htmlFor="biographyOromo" className={label}>Biography (Afaan Oromoo)</label>
        <textarea id="biographyOromo" name="biographyOromo" rows={8}
          defaultValue={about.biographyOromo} className={input} />
      </div>

      <div>
        <label htmlFor="biographyArabic" className={label}>Biography (Arabic)</label>
        <textarea id="biographyArabic" name="biographyArabic" rows={8} dir="rtl"
          defaultValue={about.biographyArabic} className={input} />
      </div>

      <div>
        <label htmlFor="education" className={label}>Education and teachers (one per line)</label>
        <textarea id="education" name="education" rows={5}
          defaultValue={about.education} className={input} />
      </div>

      <div>
        <label htmlFor="works" className={label}>Scholarly work (one per line)</label>
        <textarea id="works" name="works" rows={5}
          defaultValue={about.works} className={input} />
      </div>

      <div>
        <label htmlFor="timeline" className={label}>Timeline (one per line, like: 1990 | Event)</label>
        <textarea id="timeline" name="timeline" rows={6}
          defaultValue={about.timeline} className={input} />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}

      <button type="submit" disabled={busy}
        className="rounded-lg bg-primary hover:bg-primary-strong px-4 py-2 text-white disabled:opacity-50">
        {busy ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}