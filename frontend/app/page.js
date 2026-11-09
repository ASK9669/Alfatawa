import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    icon: "☪",
    title: "Ibaadaa",
    subtitle: "Salaata,Soomanafi kkf",
    description:
      "Islaamummaa keessatti barnoota ibaadaa irratti hubanoo gahaa argachuuf.",
  },
  {
    icon: "⌂",
    title: "Maatii",
    subtitle: "Maatiifi Hariiroo Hawaasummaa",
    description:
      "Qajeelfama Maatii, fuudhaafi heeruma hawaasa Muslimaa karaa sirrii taheen hubachuuf.",
  },
  {
    icon: "⚖",
    title: "Mu'aamalaa",
    subtitle: "Diinadgeefi Hojii Guyyaa Guyyaa",
    description:
      "hubannoo sirrii Sochii diinadgdee,daldalaafi hojii guyyaa guyyaa keessatti karaa duudhaa Amantaa Islaamaa eeggateen hubachuu.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf5]">
      {/* HERO SECTION */}
      <section className="relative bg-[#064e35] text-white">
        {/* QURAN VERSE */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#e5d4a1] bg-white px-6 py-10 text-center shadow-sm sm:px-12">
            <span className="text-sm font-bold tracking-widest text-[#a78328]">
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-6xl">
                Al-Fataawaa Afaan Oromoo
              </h1>
            </span>

            <h2
              className="mt-6 text-2xl font-bold leading-loose text-[#064e35] sm:text-4xl"
              dir="rtl"
            >
              وَمَآ أَرْسَلْنَا مِن قَبْلِكَ إِلَّا رِجَالًا نُّوحِىٓ
              إِلَيْهِمْ ۚ فَسْـَٔلُوٓا۟ أَهْلَ ٱلذِّكْرِ إِن كُنتُمْ لَا
              تَعْلَمُونَ
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base  text-[#064e35] sm:text-lg">
              "Siin duratti nama tokkoyyuu hin ergine gama isaatti beeksisa
              goonu malee, yoo kan hin beekne taatan Warroota beekumsa kennaman
              Gaafadhaa"{" "}
            </p>

            <p className="mt-4 font-semibold text-[#a78328]">
              (Surah An-Nahl, 16:43)
            </p>
          </div>
        </section>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="overflow-hidden rounded-3xl border-4 border-[#d9b85b] shadow-2xl">
              <Image
                src="/Al-Fataawaa.png"
                alt="Fotoon duwwaadha"
                width={1024}
                height={1024}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>

          <div>
            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Al-Fataawaa
              <span className="mt-2 block text-[#e8c66b]">Afaan Oromoo</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-green-50 sm:text-lg">
              Amantiin Islaama namoonni waan hin beekne hayyoota irraa akka
              gaafatan nu barsiisa. Beekumsa sirrii barbaaduufi dhimma amantii
              keessatti Ulamoota gaafatanii hubachuun barbaachisaadha.
              Weebsaayitiin kun madda beekumsa Amantaa Islaamaa fi qajeelfama
              shari'aa Afaan Oromootiin isiniif dhiyeessa. Weebsayitii kana
              irratti Gaafilee Shari'aa gaafachuu, Fatwaalee armaan duraa{" "}
              <strong>
                <i>Doktor Jibriil Qamar</i>
              </strong>
              iin kennaman Ilaaluufi Sagantaalee Muhaadaraa, barnootaafi gorsa
              Gaggababoo karaa salphaan akka hordoftaniif isin gargaara.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/ask"
                className="rounded-xl bg-[#e8c66b] px-3 py-3.5 font-bold text-[#064e35] shadow-lg transition hover:bg-[#f3d987] hover:text-black hover:shadow-xl"
              >
                Muftii Gaafadhu
              </Link>

              <Link
                href="/fatwas"
                className="rounded-xl border border-white/50 px-3 py-3.5 font-semibold text-white transition hover:bg-white/10 hover:text-[#e8c66b] hover:shadow-lg"
              >
                Fatawaa Dubbisi
              </Link>
            </div>
          </div>

          {/* Hero poster */}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#f0f5ed] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="mt-3 text-3xl font-bold text-[#064e35]">
              RAMADDII FATWAALEE
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Weebsaayitii kana irratti Fatwaalee Ramaddii armaan gadiitiin
              Ramadamu
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={`/fatwas?category=${category.slug}`}
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
                  Fatwaa Ilaali
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="mt-3 text-3xl font-bold text-[#064e35]">
              Al-Fataawaan akkamiin hojjata
            </h2>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Gaafii keessan erguu",
                description:
                  "gaafii keessan karaa Muftii gaafadhu jedhuun ergitu",
              },
              {
                number: "02",
                title: "Gaafiin keessan ilaalamuu",
                description:
                  "Sheekni Gaafii keessan erga ilaalanii booda deebii ni maxxansu",
              },
              {
                number: "03",
                title: "Deebii Erguu",
                description:
                  "Deebiin Sheekaa erga maxxanfamee booda beeksifni karaa email keessanii isin qaqqaba",
              },
              {
                number: "04",
                title: "Deebii Ilaaluu",
                description:
                  "Deebiin Sheekaa erga maxxanfamee booda weebsaayitii kana irratti argachuu dandeessu",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#064e35] text-xl font-bold text-[#e8c66b]">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#064e35]">
                  {step.title}
                </h3>

                <p className="mt-1 text-sm  text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPORTANCE OF ISLAMIC KNOWLEDGE */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="mt-3 text-2xl font-bold text-[#064e35]">
              Barbaachisummaa Fatwaa
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <span className="text-3xl"></span>

              <h3 className="mt-5 font-bold text-[#064e35]">
                Beekumsa Amantii Dabala
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Namni muslimaa tokko waa'ee amantii isaa karaa sirrii taheen
                akka hubatuuf gargaara.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <span className="text-3xl"></span>

              <h3 className="mt-5 font-bold text-[#064e35]">
                Gaaffiiwwan deebisa
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Gaaffiiwwan ibaadaa, maatii, daldalaa fi dhimma jireenyaa
                irratti hawaasa muslimaa irraa ka'aniif deebii kenna.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <span className="text-3xl"></span>

              <h3 className="mt-5 font-bold text-[#064e35]">
                Dogoggora irraa baraara
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Namni Muslimaa tokko hojii sirriifi sirrii hin taane addaan
                baase akka hubatuuf gargaara.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <span className="text-3xl"></span>

              <h3 className="mt-5 font-bold text-[#064e35]">
                Rakkoolee hawaasaa fura
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Rakkoolee jireenya guyyaa guyyaa keessatti Muslimoonni mudatan
                irratti qajeelfamaafi furmaataa ni kenna.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <span className="text-3xl"></span>

              <h3 className="mt-5 font-bold text-[#064e35]">
                Qur'aanaafi Hadiisa Hubachiisa
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                hawaasni muslimaa qur'aana kabajamaafi Hadiisaa ergamaa rabbi
                (SAW) karaa sirriin akka hubatan ni taasisa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECOND QURAN VERSE */}
      <section className="bg-[#064e35] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#e8c66b]">
            Barbaachisummaa Beekumsa Islaamaa
          </span>

          <h2
            className="mt-6 text-3xl font-bold leading-relaxed sm:text-4xl"
            dir="rtl"
          >
            فَلَوۡلَا نَفَرَ مِن كُلِّ فِرۡقَةٖ مِّنۡهُمۡ طَآئِفَةٞ
            لِّيَتَفَقَّهُواْ فِي ٱلدِّينِ وَلِيُنذِرُواْ قَوۡمَهُمۡ إِذَا
            رَجَعُوٓاْ إِلَيۡهِمۡ لَعَلَّهُمۡ يَحۡذَرُونَ
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-green-50">
            “Garee tokko irraa murni muraasni deemanii beekumsa Amantii Islaamaa
            haa baratanii,akka booda gara tuuta isaanii deebi'anii
            isaandinniinaniif”
          </p>

          <p className="mt-5 font-semibold text-[#e8c66b]">
            (Surah At-Tawbah, 9:122)
          </p>

          <div className="mx-auto mt-8 max-w-3xl border-t border-white/20 pt-8">
            <h3 className="mt-5 text-2xl leading-loose" dir="rtl">
              مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ
            </h3>

            <p className="mt-4 leading-8 text-green-50">
              “nama Rabbiin Keyrii guutuu isaaf fedhe beeka diinii(faqiiha) isa
              taasisa”
            </p>

            <p className="mt-4 text-sm font-semibold text-[#e8c66b]">
              (Sahih al-Bukhari 71)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
// sagantaaa Ukuwwaa
// aasar azzunubi
// sharhArbaiina Annawaiw
// Rahmatan Lilalamiin
// malayasau taajira jahluhu
//
