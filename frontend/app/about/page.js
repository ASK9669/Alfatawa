import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import About from "@/models/About";
import { connection } from "next/server";

export const metadata = { title: "About the Sheikh" };

async function AboutContent() {
  await connection(); // new line: "build this page when someone visits it"
  await connectDB();
  const a = await About.findOne({ key: "sheikh" }).lean();
  if (!a) return <p>fuulli kun yeroo gabaaabaa keessatti gadi lakkifam</p>;
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
            alt={a.nameOromo || "The Sheikh"}
            className="h-40 w-40 rounded-full object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">{a.nameOromo}</h1>
      </div>

      {a.biographyOromo && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Seenaa jireenya</h2>
          <p className="whitespace-pre-line">{a.biographyOromo}</p>
        </section>
      )}

      {(a.nameArabic || a.biographyArabic) && (
        <section dir="rtl" lang="ar" className="space-y-2 border-t pt-4">
          {a.nameArabic && (
            <h2 className="text-xl font-bold">{a.nameArabic}</h2>
          )}
          {a.biographyArabic && (
            <p className="whitespace-pre-line">{a.biographyArabic}</p>
          )}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Tajaajila Hawaasaa(Suudan)
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            {education.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {works.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Tajaajila Hawaasaa(Itiyoophiyaa)
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            {works.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {timeline.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold"></h2>
          <p className="whitespace-pre-line"> </p>
        </section>
      )}
      <span className="text-md text-blue-600 m-5">
        <a
          href="https://youtu.be/fUkEYT1QEII?si=grK9ck8zyoZQsF-P"
          target="_blank"
          rel="noopener noreferrer"
        >
          Seenaa Gabaabaa Africa TV waliin
        </a>
      </span>
      <span className="text-md text-blue-600">
        <a
          href="https://www.youtube.com/watch?v=ALOmFui3X8k&pp=ygUac2ltYW5uYWEgRHIgamlicm9vbCBxYW1hciA%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          Simannaa Dr Jibriil Qamar Magaalaa Adaamaatti
        </a>
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 bg-green-50 border border-green-200 border-l-5 border-t-5  border-green-500 rounded-lg shadow-md">
      <Suspense fallback={<p>Loading...</p>}>
        <AboutContent />
      </Suspense>
    </main>
  );
}
