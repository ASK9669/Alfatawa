import { Suspense } from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Fatwa from "@/models/Fatwa";
import Category from "@/models/Category";
import FatwaNumber from "@/components/FatwaNumber";
import { connection } from "next/server";

export const metadata = { title: "Fatwas" };

const PAGE_SIZE = 10;
const APOSTROPHES = /[’‘ʼ`´]/g;

function buildSearchFilter(q) {
  const clean = q.replace(APOSTROPHES, "'").trim().slice(0, 100);
  if (!clean) return null;

  const pattern = clean
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/'/g, "['’‘ʼ`´]");
  const rx = new RegExp(pattern, "i");

  const or = [{ questionOromo: rx }, { answerOromo: rx }];
  if (/^\d{1,9}$/.test(clean)) or.push({ number: Number(clean) });
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

  const filter = { status: "Published" };
  if (current) filter.category = current._id;
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

  const chip =
    "rounded-md border bg-surface px-3 py-2 text-sm hover:border-primary";
  const chipActive =
    "rounded-md border border-primary bg-primary px-3 py-2 text-sm text-white";
  const pagerLink =
    "rounded-md border bg-surface px-4 py-2.5 text-sm font-medium hover:border-primary";

  return (
    <>
      <form action="/fatwas" method="get" role="search" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          maxLength={100}
          aria-label="Search fatwas"
          placeholder="Search by word or fatwa number"
          className="min-w-0 flex-1 rounded-md border bg-surface px-3 py-2.5"
        />
        {current && (
          <input type="hidden" name="category" value={current.slug} />
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-strong"
        >
          Search
        </button>
      </form>

      <nav aria-label="Categories" className="mt-4 flex flex-wrap gap-2">
        <Link href={listLink("", q)} className={current ? chip : chipActive}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={listLink(c.slug, q)}
            className={current?.slug === c.slug ? chipActive : chip}
          >
            {c.nameOromo}
          </Link>
        ))}
      </nav>

      {q && (
        <p className="mt-5 text-sm text-muted">
          {total} {total === 1 ? "result" : "results"} for “{q}”.{" "}
          <Link
            href={listLink(current?.slug, "")}
            className="text-primary underline"
          >
            Clear search
          </Link>
        </p>
      )}

      {fatwas.length === 0 ? (
        <p className="mt-8 text-muted">
          {q
            ? "No fatwas found. Try another word, or type a fatwa number."
            : "No fatwas in this category yet."}
        </p>
      ) : (
        <ul className="mt-6 divide-y border-y">
          {fatwas.map((f) => (
            <li key={String(f._id)}>
              <Link
                href={`/fatwas/${f.slug}`}
                className="flex gap-4 px-1 py-5 hover:bg-surface sm:gap-6"
              >
                <div className="w-20 shrink-0 sm:w-24">
                  <FatwaNumber number={f.number} />
                </div>
                <div className="min-w-0 flex-1">
                  {f.category && names[String(f.category)] && (
                    <p className="mb-1 text-sm font-medium text-primary">
                      {names[String(f.category)]}
                    </p>
                  )}
                  <p className="line-clamp-3 whitespace-pre-line">
                    {f.questionOromo}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-between gap-3"
          aria-label="Pages"
        >
          {page > 1 ? (
            <Link
              href={listLink(current?.slug, q, page - 1)}
              className={pagerLink}
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={listLink(current?.slug, q, page + 1)}
              className={pagerLink}
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function FatwaListPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Fatwas</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <FatwaBrowser searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
