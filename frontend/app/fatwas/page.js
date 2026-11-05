import { Suspense } from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Fatwa from "@/models/Fatwa";
import Category from "@/models/Category";
import FatwaNumber from "@/components/FatwaNumber";
import { connection } from "next/server";

export const metadata = { title: "Fatwas | Al-Fataawaa" };

const PAGE_SIZE = 10;
const APOSTROPHES = /[’‘ʼ`´]/g;

const CATEGORY_ICONS = {
  ibaadaa: "☪",
  maatii: "⌂",
  muaamalaa: "⚖",
};

function buildSearchFilter(q) {
  const clean = q.replace(APOSTROPHES, "'").trim().slice(0, 100);
  if (!clean) return null;

  const pattern = clean
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/'/g, "['’‘ʼ`´]");

  const rx = new RegExp(pattern, "i");

  const or = [{ questionOromo: rx }, { answerOromo: rx }];

  if (/^\d{1,9}$/.test(clean)) {
    or.push({ number: Number(clean) });
  }

  return { $or: or };
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function listLink(categorySlug, q, page) {
  const p = new URLSearchParams();

  if (categorySlug) p.set("category", categorySlug);
  if (q) p.set("q", q);
  if (page && page > 1) p.set("page", String(page));

  const s = p.toString();
  return s ? `/fatwas?${s}` : "/fatwas";
}

async function FatwaBrowser({ searchParams }) {
  await connection();

  const params = await searchParams;

  const slug = String(first(params.category) || "");
  const q = String(first(params.q) || "").slice(0, 100);

  const requestedPage = Math.min(
    Math.max(Number.parseInt(String(first(params.page) || "1"), 10) || 1, 1),
    100000,
  );

  await connectDB();

  const categories = await Category.find().sort({ nameOromo: 1 }).lean();

  const current = categories.find((c) => c.slug === slug);

  // Build database filter
  const filter = { status: "Published" };

  if (slug) {
    if (current) {
      filter.category = current._id;
    } else {
      // Invalid category should not show all fatwas
      filter._id = { $exists: false };
    }
  }

  const search = buildSearchFilter(q);
  if (search) Object.assign(filter, search);

  const total = await Fatwa.countDocuments(filter);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const page = Math.min(requestedPage, totalPages);

  const fatwas = await Fatwa.find(filter)
    .sort({ number: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select("number slug questionOromo category")
    .lean();

  const names = Object.fromEntries(
    categories.map((c) => [String(c._id), c.nameOromo]),
  );

  const activeCategory = current?.nameOromo || "All Fatwas";

  return (
    <div className="space-y-8">
      {/* Category section */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href={listLink("", q)}
            className={`rounded-2xl border p-4 text-center transition hover:-translate-y-1 hover:shadow-md ${
              !current
                ? "border-[#087443] bg-[#eaf3e9] shadow-sm"
                : "border-gray-200 bg-white hover:border-[#c6a84f]"
            }`}
          >
            <div className="text-2xl">📚</div>
            <p className="mt-2 text-sm font-bold text-[#064e35]">
              Fatwaalee Hunda
            </p>
          </Link>

          {categories.map((c) => {
            const active = current?.slug === c.slug;

            return (
              <Link
                key={c.slug}
                href={listLink(c.slug, q)}
                className={`rounded-2xl border p-4 text-center transition hover:-translate-y-1 hover:shadow-md ${
                  active
                    ? "border-[#087443] bg-[#eaf3e9] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#c6a84f]"
                }`}
              >
                <div className="text-2xl">{CATEGORY_ICONS[c.slug] || "📖"}</div>

                <p className="mt-2 text-sm font-bold text-[#064e35]">
                  {c.nameOromo}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Search section */}
      <section className="rounded-2xl border border-[#e8e4d5] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#064e35]">Fatwaa barbaadi</h2>
        </div>

        <form
          action="/fatwas"
          method="get"
          role="search"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={100}
            aria-label="Search fatwas"
            placeholder="lakkoofsa, jecha ykn gaafii seeraan qubeessi"
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-[#fafaf7] px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10"
          />

          {current && (
            <input type="hidden" name="category" value={current.slug} />
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#087443] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#064e35]"
          >
            Search
          </button>
        </form>
      </section>

      {/* Fatwa list heading */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mt-1 text-2xl font-bold text-[#064e35]">
              {activeCategory}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {total} {total === 1 ? "" : " "}
            </p>
          </div>

          {current && (
            <Link
              href="/fatwas"
              className="text-sm font-semibold text-[#087443] hover:underline"
            >
              hundaa laali
            </Link>
          )}
        </div>

        {q && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#eaf3e9] p-4 text-sm">
            <p className="text-[#064e35]">
              Jecha <strong>“{q}”</strong> kanaaf barbaaddee
            </p>

            <Link
              href={listLink(current?.slug, "")}
              className="font-semibold text-[#087443] underline"
            >
              haqi
            </Link>
          </div>
        )}

        {/* Empty state */}
        {fatwas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
            <div className="text-5xl">📖</div>

            <h3 className="mt-4 text-lg font-bold text-[#064e35]">
              Fatwaa hin argamne
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {q
                ? "We couldn't find any fatwas matching your search. Try another keyword."
                : "There are no published fatwas in this category yet. Please check back later."}
            </p>

            <Link
              href="/fatwas"
              className="mt-6 inline-block rounded-xl bg-[#087443] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064e35]"
            >
              Fatwaa Hunda Laali
            </Link>
          </div>
        ) : (
          /* Fatwa cards */
          <div className="grid gap-4">
            {fatwas.map((f) => (
              <Link
                key={String(f._id)}
                href={`/fatwas/${f.slug}`}
                className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-600 border border-green-200  border-l-6 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Fatwa number */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#075c3b] transition  group-hover:text-white">
                    <FatwaNumber number={f.number} />
                  </div>

                  {/* Fatwa information */}
                  <div className="min-w-0 flex-1">
                    {f.category && names[String(f.category)] && (
                      <span className="inline-block rounded-full bg-[#f8f2df] px-3 py-1 text-xs font-semibold text-[#987522]">
                        {names[String(f.category)]}
                      </span>
                    )}

                    <p className="mt-3 whitespace-pre-line text-base font-semibold leading-7 text-gray-800 transition group-hover:text-[#087443] sm:text-lg">
                      {f.questionOromo}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">
                        Fatwaa #{f.number}
                      </span>

                      <span className="text-sm font-semibold text-[#087443] transition group-hover:translate-x-1">
                        Fatwaa Dubbisi
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6"
          aria-label="Pages"
        >
          {page > 1 ? (
            <Link
              href={listLink(current?.slug, q, page - 1)}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#064e35] transition hover:border-[#087443]"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm font-medium text-gray-500">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={listLink(current?.slug, q, page + 1)}
              className="rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064e35]"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}

export default function FatwaListPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-gray-500">
            Loading fatwas...
          </div>
        }
      >
        <FatwaBrowser searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
