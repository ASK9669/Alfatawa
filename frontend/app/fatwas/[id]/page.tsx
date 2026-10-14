
type Fatwa = {
  id: string;
  title: string;
  category: string;
  question: string;
  answer: string;
};

const fatwas: Fatwa[] = [
  {
    id: "1",
    title: "The importance of prayer",
    category: "Ibaadaa",
    question:
      "Why is prayer important in the daily life of a Muslim?",
    answer:
      "This is placeholder content for learning how the page works. Replace it with an answer reviewed and approved by a qualified scholar before publishing.",
  },
];

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FatwaDetails({
  params,
}: PageProps) {
  const { id } = await params;

  const fatwa = fatwas.find((item) => item.id === id);

  if (!fatwa) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Fatwa not found
          </h1>
          <p className="mt-3 text-gray-600">
            We could not find a fatwa with this ID.
          </p>
          <a
            href="/"
            className="mt-6 inline-block text-green-700 hover:underline"
          >
            Back to homepage
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <a
          href="/"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to homepage
        </a>

        <div className="mt-8">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            {fatwa.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            {fatwa.title}
          </h1>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Question
            </h2>
            <p className="mt-3 leading-7 text-gray-700">
              {fatwa.question}
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Answer
            </h2>
            <p className="mt-3 leading-8 text-gray-700">
              {fatwa.answer}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
