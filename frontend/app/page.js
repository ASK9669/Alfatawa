
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    icon: '☪',
    title: 'Ibaadaa',
    subtitle: 'Prayer, fasting and worship',
    description:
      'Learn about Salah, Sawm, Zakah, Hajj and other acts of worship.',
  },
  {
    icon: '⌂',
    title: 'Maatii',
    subtitle: 'Family and relationships',
    description:
      'Explore Islamic guidance about marriage, family and social relationships.',
  },
  {
    icon: '⚖',
    title: "Mu'aamalaa",
    subtitle: 'Business and transactions',
    description:
      'Understand Islamic principles concerning trade, finance and daily dealings.',
  },
];

const features = [
  {
    icon: '📖',
    title: 'Authentic Islamic Knowledge',
    description:
      'Learn Islamic teachings through guidance based on the Quran and authentic Sunnah.',
  },
  {
    icon: '🎓',
    title: 'Ask Qualified Scholars',
    description:
      'Submit your questions and seek answers from qualified Islamic scholars.',
  },
  {
    icon: '🌍',
    title: 'Afaan Oromoo Access',
    description:
      'Access Islamic knowledge and guidance in a language our community understands.',
  },
  {
    icon: '▶',
    title: 'Video Learning',
    description:
      'Watch Islamic lessons and educational videos to increase your understanding.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf5]">

      {/* HERO SECTION */}
      <section className="relative bg-[#064e35] text-white">

        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">

          <div>
            <span className="inline-flex rounded-full border border-[#d9b85b]/50 bg-[#ffffff]/10 px-4 py-2 text-sm font-medium text-[#f3d987]">
              Islamic Knowledge • Authentic Guidance
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Al-Fataawaa
              <span className="mt-2 block text-[#e8c66b]">
                Afaan Oromoo
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-green-50 sm:text-lg">
              Madda beekumsa Islaamaa fi qajeelfama
              shari'aa Afaan Oromootiin. Gaaffii kee
              dhiyeessi, fataawaa dubbisi, barnoota
              Islaamaa irraa fayyadami.
              Madda beekumsa Islaamaa fi qajeelfama
              shari'aa Afaan Oromootiin. Gaaffii kee
              dhiyeessi, fataawaa dubbisi, barnoota
              Islaamaa irraa fayyadami.
              Madda beekumsa Islaamaa fi qajeelfama
              shari'aa Afaan Oromootiin. Gaaffii kee
              dhiyeessi, fataawaa dubbisi, barnoota
              Islaamaa irraa fayyadami.
              Madda beekumsa Islaamaa fi qajeelfama
              shari'aa Afaan Oromootiin. Gaaffii kee
              dhiyeessi, fataawaa dubbisi, barnoota
              Islaamaa irraa fayyadami.
            </p>

            <p className="mt-3 max-w-xl text-sm leading-7 text-green-100/80">
              A platform dedicated to making Islamic knowledge,
              scholarly guidance and educational resources
              accessible to the Afaan Oromoo-speaking community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/ask"
                className="rounded-xl bg-[#e8c66b] px-6 py-3.5 font-bold text-[#064e35] shadow-lg transition hover:bg-[#f3d987]"
              >
                Ask a Mufti →
              </Link>

              <Link
                href="/fatwas"
                className="rounded-xl border border-white/50 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Fatwas
              </Link>

            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/20 pt-6 text-sm text-green-100">
              <span>✓ Islamic guidance</span>
              <span>✓ Afaan Oromoo</span>
              <span>✓ Educational videos</span>
            </div>
          </div>

          {/* Hero poster */}
          <div className="mx-auto w-full max-w-[480px]">
            <div className="overflow-hidden rounded-3xl border-4 border-[#d9b85b] shadow-2xl">
              <Image
                src="/ask-mufti-banner.png"
                alt="Al-Fataawaa Ask Mufti Islamic guidance"
                width={1024}
                height={1024}
                priority
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-center text-sm text-green-100">
              فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ
            </p>
          </div>

        </div>
      </section>

      {/* QURAN VERSE */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#e5d4a1] bg-white px-6 py-10 text-center shadow-sm sm:px-12">

          <span className="text-sm font-bold uppercase tracking-widest text-[#a78328]">
            Guidance from the Quran
          </span>

          <h2 className="mt-6 text-2xl font-bold leading-loose text-[#064e35] sm:text-4xl" dir="rtl">
            فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
            “So ask the people of knowledge if you do not know.”
          </p>

          <p className="mt-4 font-semibold text-[#a78328]">
            Surah An-Nahl, 16:43
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500">
            Islaamni namoota waan hin beekne
            hayyoota irraa akka gaafatan nu barsiisa.
            Kanaaf beekumsa sirrii barbaaduun
            fi dhimma amantii keessatti hayyoota
            gaafachuun barbaachisaadha.
          </p>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#f0f5ed] px-5 py-16 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#a78328]">
              Explore Islamic Topics
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#064e35]">
              Explore Our Fatwa Categories
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Find Islamic guidance across important areas of
              everyday Muslim life.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {categories.map((category) => (
              <Link
                key={category.title}
                href="/fatwas"
                className="group rounded-2xl border border-[#e3dfce] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#c6a84f] hover:shadow-lg"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3e9] text-3xl text-[#075c3b]">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#064e35]">
                  {category.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-[#a78328]">
                  {category.subtitle}
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {category.description}
                </p>

                <span className="mt-6 inline-block font-semibold text-[#087443] group-hover:underline">
                  Explore Fatwas →
                </span>

              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* IMPORTANCE OF ISLAMIC KNOWLEDGE */}
      <section className="px-5 py-16 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#a78328]">
              Our Purpose
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#064e35]">
              Why Islamic Knowledge Matters
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
              Knowledge helps Muslims understand their religion,
              worship Allah correctly and build a community
              guided by authentic Islamic teachings.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="text-3xl">{feature.icon}</span>

                <h3 className="mt-5 font-bold text-[#064e35]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SECOND QURAN VERSE */}
      <section className="bg-[#064e35] px-5 py-16 text-white sm:px-8">

        <div className="mx-auto max-w-5xl text-center">

          <span className="text-sm font-bold uppercase tracking-widest text-[#e8c66b]">
            The Importance of Understanding Religion
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-relaxed sm:text-4xl" dir="rtl">
            فَلَوْلَا نَفَرَ مِن كُلِّ فِرْقَةٍ مِّنْهُمْ طَائِفَةٌ لِّيَتَفَقَّهُوا فِي الدِّينِ
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-green-50">
            “A group from every community should devote themselves
            to gaining understanding of the religion and warn
            their people when they return to them.”
          </p>

          <p className="mt-5 font-semibold text-[#e8c66b]">
            Surah At-Tawbah, 9:122
          </p>

          <div className="mx-auto mt-8 max-w-3xl border-t border-white/20 pt-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#e8c66b]">
              Hadith of Prophet Muhammad ﷺ
            </p>

            <h3 className="mt-5 text-2xl leading-loose" dir="rtl">
              مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ
            </h3>

            <p className="mt-4 leading-8 text-green-50">
              “When Allah wishes good for someone, He grants
              him understanding of the religion.”
            </p>

            <p className="mt-4 text-sm font-semibold text-[#e8c66b]">
              Sahih al-Bukhari 71
            </p>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-16 sm:px-8">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#a78328]">
              Simple and Accessible
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#064e35]">
              How Al-Fataawaa Works
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">

            {[
              {
                number: '01',
                title: 'Ask Your Question',
                description:
                  'Submit your Islamic question through our Ask Mufti page.',
              },
              {
                number: '02',
                title: 'Scholarly Review',
                description:
                  'Your question is reviewed before an answer is published.',
              },
              {
                number: '03',
                title: 'Read and Learn',
                description:
                  'Explore published answers and benefit from Islamic knowledge.',
              },
            ].map((step) => (
              <div key={step.number} className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#064e35] text-xl font-bold text-[#e8c66b]">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#064e35]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 pb-16 sm:px-8">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#075c3b] px-6 py-12 text-center text-white shadow-xl sm:px-12">

          <span className="text-4xl">📖</span>

          <h2 className="mt-5 text-3xl font-bold">
            Have an Islamic Question?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-green-50">
            Do not hesitate to seek knowledge. Submit your
            question and let us help you find scholarly guidance.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/ask"
              className="rounded-xl bg-[#e8c66b] px-7 py-3.5 font-bold text-[#064e35] transition hover:bg-[#f3d987]"
            >
              Ask the Mufti →
            </Link>

            <Link
              href="/fatwas"
              className="rounded-xl border border-white/50 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Read Fatwas
            </Link>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e5dfca] bg-white px-5 py-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">

          <div>
            <h2 className="text-xl font-extrabold text-[#064e35]">
              Al-Fataawaa
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Islamic knowledge in Afaan Oromoo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium text-gray-600">

            <Link href="/fatwas" className="hover:text-[#087443]">
              Fatwas
            </Link>

            <Link href="/ask" className="hover:text-[#087443]">
              Ask Mufti
            </Link>

            <Link href="/about" className="hover:text-[#087443]">
              About
            </Link>

            <Link href="/youtube" className="hover:text-[#087443]">
              YouTube
            </Link>

          </div>

        </div>

        <p className="mx-auto mt-8 max-w-7xl border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          {/* © {new Date().getFullYear()} Al-Fataawaa. All rights reserved. */}
        </p>

      </footer>

    </main>
  );
}
