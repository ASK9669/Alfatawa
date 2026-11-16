import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import About from "@/models/About";
import { connection } from "next/server";
import { FaYoutube } from "react-icons/fa";

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
          <p className="whitespace-pre-line text-gray-700 leading-8 text-justify">
            {a.biographyOromo}
          </p>
        </section>
      )}

      {(a.nameArabic || a.biographyArabic) && (
        <section dir="rtl" lang="ar" className="space-y-2 border-t pt-4">
          {a.nameArabic && (
            <h2 className="text-xl font-bold">{a.nameArabic}</h2>
          )}
          {a.biographyArabic && (
            <p className="whitespace-pre-line text-gray-700 leading-8 text-justify">
              {a.biographyArabic}
            </p>
          )}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Tajaajila Hawaasaa(Suudan)
          </h2>
          <ul className="list-disc space-y-1 pl-5 whitespace-pre-line text-gray-700 leading-8 text-justify">
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
          <ul className="list-disc space-y-1 pl-5 whitespace-pre-line text-gray-700 leading-8 text-justify">
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
      <p className="whitespace-pre-line text-gray-700 leading-8 text-justify">Walumaagalatti, Dr. Jibriil Qamar  hayyuu Islaamaa  hawaasa Muslimaatiif Fatwaalee karaa adda addaatiin, barnoota ilmii Shari'aa, muhaadaraaleefi leenjiwwan gargaraa  kennuun  tajaajilaa jiruudha.
 Dr. Jibriil Qamar  nama beekumsa baratee qofa osoo hin taane, beekumsa argatan dhalootaaf dabarsuu fi hawaasa isaanii tajaajiluuf of kenneedha. Kaayyoon isaanii beekumsa Islaamaa sirrii, hubannoo Shari'aa fi naamusa Islaamaa hawaasa keessatti cimsuun, keessumaa dhaloota Afaan Oromoo dubbatuuf beekumsa Shari'aa afaan isaaniitiin dhiyeessuudha.
 Hojii isaanii kana keessatti Alfataawaa Afaan Oromoo karaa tokkoon beekumsa Shari'aa hawaasa biraan ga'uu fi gaaffiiwwan hawaasaa irratti hubannoo sirrii uumuuf gumaacha isaanii itti fufsiisaa jira.
 Rabbiin beekumsa isaanii keessaa barakaa haa kaaayu, hojii isaanii  irraa haa qeebalu, umrii isaanii fayyaa keessatti nuuf haa dheeressu . hawaasni Muslimaas nama beekumsa Ulamootaa fayyadamu nu haa taasisu .</p>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* First video */}
        <a
          href="https://youtu.be/fUkEYT1QEII?si=grK9ck8zyoZQsF-P"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
            <FaYoutube size={30} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-ink group-hover:text-primary">
              Seenaa Gabaabaa
            </h3>
            <p className="mt-1 text-sm text-muted">Africa TV waliin</p>
          </div>
        </a>

        {/* Second video */}
        <a
          href="https://www.youtube.com/watch?v=ALOmFui3X8k&pp=ygUac2ltYW5uYWEgRHIgamlicm9vbCBxYW1hciA%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
            <FaYoutube size={30} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-ink group-hover:text-primary">
              Simannaa Dr Jibriil Qamar
            </h3>
            <p className="mt-1 text-sm text-muted">Magaalaa Adaamaatti</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-green-50 border border-green-200 border-l-4 border-green-500 rounded-lg shadow-md text-lg whitespace-pre-line text-gray-700 leading-8 text-justify ">
      <Suspense fallback={<p>Loading...</p>}>
        <AboutContent />
      </Suspense>
    </main>
  );
}
