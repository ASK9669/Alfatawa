import { Suspense } from 'react';
import { connectDB } from '@/lib/db';
import About from '@/models/About';
import {connection} from 'next/server';

export const metadata = { title: 'About the Sheikh' };

async function AboutContent() {
  await connection();   // new line: "build this page when someone visits it"
  await connectDB();
  const a = await About.findOne({ key: 'sheikh' }).lean();
  if (!a) return <p>This page is coming soon.</p>;
  // ...the rest of the file stays exactly the same
  
  const education = a.education || [];
  const works = a.works || [];
  const timeline = a.timeline || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {a.photoUrl && (
          <img
            src={a.photoUrl}
            alt={a.nameOromo || 'The Sheikh'}
            className="h-40 w-40 rounded-full object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">{a.nameOromo}</h1>
      </div>

      {a.biographyOromo && (
        <section>
          <p className="whitespace-pre-line">{a.biographyOromo}</p>
        </section>
      )}

      {(a.nameArabic || a.biographyArabic) && (
        <section dir="rtl" lang="ar" className="space-y-2 border-t pt-4">
          {a.nameArabic && <h2 className="text-xl font-bold">{a.nameArabic}</h2>}
          {a.biographyArabic && <p className="whitespace-pre-line">{a.biographyArabic}</p>}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Education and teachers</h2>
          <ul className="list-disc space-y-1 pl-5">
            {education.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      {works.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Scholarly work</h2>
          <ul className="list-disc space-y-1 pl-5">
            {works.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      {timeline.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Timeline</h2>
          <ol className="space-y-2 border-l pl-4">
            {timeline.map((t, i) => (
              <li key={i}>
                {t.year && <span className="font-semibold">{t.year} </span>}
                {t.text}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <AboutContent />
      </Suspense>
    </main>
  );
}