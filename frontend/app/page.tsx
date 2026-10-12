
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";

const categories = [
  {
    name: "Ibaadaa",
    description: "Prayer, fasting, and worship",
    icon: "☪",
  },
  {
    name: "Mu'aamalaa",
    description: "Business and transactions",
    icon: "⚖",
  },
  {
    name: "Maatii",
    description: "Family and relationships",
    icon: "⌂",
  },
];

// Demonstration data only, not authentic Islamic rulings.
const fatwas = [
  {
    id: 1,
    title: "Understanding Prayer",
    category: "Ibaadaa",
    description:
      "A sample entry about prayer and worship.",
  },
  {
    id: 2,
    title: "Business Transactions",
    category: "Mu'aamalaa",
    description:
      "A sample entry about business and transactions.",
  },
  {
    id: 3,
    title: "Family Relationships",
    category: "Maatii",
    description:
      "A sample entry about family relationships.",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter fatwas using the search text and selected category.
  const filteredFatwas = fatwas.filter((fatwa) => {
    const matchesSearch =
      fatwa.title.toLowerCase().includes(search.toLowerCase()) ||
      fatwa.description.toLowerCase().includes(search.toLowerCase()) ||
      fatwa.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      fatwa.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      {/* Navigation */}
      <header className="border-b border-stone-200 bg-white">
        <Navbar />
      </header>

      {/* Hero */}
      <section className="bg-emerald-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Afaan Oromoo · العربية
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Find Answers to Your Islamic Questions
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-emerald-100">
            Explore published Islamic fatwas, learn from scholarly
            answers, and discover guidance for everyday life.
          </p>

          <a
            href="#fatwas"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-emerald-950 hover:bg-emerald-50"
          >
            Explore Fatwas →
          </a>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <label
          htmlFor="fatwa-search"
          className="mb-3 block text-lg font-semibold"
        >
          Search Islamic questions
        </label>

        <input
          id="fatwa-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search fatwas by keyword..."
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-4 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        />

        <p className="mt-2 text-sm text-stone-500">
          Search by title, description, or category.
        </p>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-6xl px-6 pb-16"
      >
        <h2 className="text-2xl font-bold">
          Browse by Category
        </h2>

        <p className="mt-2 text-stone-600">
          Choose a topic to filter the fatwas.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              icon={category.icon}
              onClick={() => {
                setSelectedCategory(category.name);

                document
                  .getElementById("fatwas")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-stone-600">
            Selected category:{" "}
            <span className="font-semibold text-emerald-800">
              {selectedCategory || "All categories"}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
          >
            Show all categories
          </button>
        </div>
      </section>

      {/* Fatwa Results */}
      <section
        id="fatwas"
        className="bg-white px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold">
            Fatwa Results
          </h2>

          <p className="mt-2 text-stone-600">
            Browse our demonstration fatwa entries.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {filteredFatwas.map((fatwa) => (
              <article
                key={fatwa.id}
                className="rounded-xl border border-stone-200 bg-stone-50 p-6 transition hover:shadow-md"
              >
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
                  {fatwa.category}
                </span>

                <h3 className="mt-4 text-lg font-bold">
                  {fatwa.title}
                </h3>

                <p className="mt-3 leading-7 text-stone-600">
                  {fatwa.description}
                </p>

                <p className="mt-4 text-xs text-amber-800">
                  Demonstration content only — not an actual fatwa.
                </p>
              </article>
            ))}
          </div>

          {filteredFatwas.length === 0 && (
            <div className="mt-6 rounded-xl bg-stone-50 p-8 text-center">
              <h3 className="font-semibold">
                No matching fatwas found
              </h3>

              <p className="mt-2 text-stone-600">
                Try another keyword or clear your category filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="mt-4 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ask the Mufti */}
      <section
        id="ask"
        className="px-6 py-16"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-900 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold">
            Have an Islamic Question?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-100">
            We plan to provide a way for visitors to submit
            questions to qualified scholars.
          </p>

          <p className="mt-5 text-sm text-amber-200">
            Question submission will be implemented in a later step.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-stone-600">
          <p className="font-semibold text-emerald-900">
            Al-Fataawaa
          </p>

          <p className="mt-2">
            Afaan Oromoo Islamic Fatwa Platform · Afaan Oromoo · العربية
          </p>

          <p className="mt-4">
            © {new Date().getFullYear()} Al-Fataawaa
          </p>
        </div>
      </footer>
    </main>
  );
}
