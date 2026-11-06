import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Fatwa from "@/models/Fatwa";
import LogoutButton from "./LogoutButton";
import BackButton from "./BackButton";

const BADGE = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Draft: "bg-gray-100 text-gray-600 ring-gray-200",
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Stat({ label, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-primary">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">Fatwaa</p>
    </div>
  );
}

const actions = [
  {
    title: "Fatwaa Haaraa Maxxansi",
    description: "Fatwaa haaraa maxxansi ykn qopheessi.",
    href: "/admin/fatwas/new",
    icon: "✍️",
  },
  {
    title: "Fatwaa Olbaasi",
    description: "Fatwaa dura qophaahe olbaasi",
    href: "/admin/import",
    icon: "📥",
  },
  {
    title: "YouTube",
    description: "Sagantaalee YouTube qopheessi ykn maxxansi.",
    href: "/admin/youtube",
    icon: "▶️",
  },
  {
    title: "Edit Godhi",
    description: "About page fi settings edit godhi.",
    href: "/admin/about",
    icon: "⚙️",
  },
  {
    title: "Fatwaa Hunda",
    description: "Fatwaa hunda barbaadi, fooyyessi ykn haqi.",
    href: "/admin/fatwas",
    icon: "🗂️",
  },
];

function FatwaRow({ f }) {
  return (
    <li>
      <Link
        href={`/admin/fatwas/${String(f._id)}`}
        className="group flex flex-col gap-3 rounded-xl px-4 py-4 transition hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                BADGE[f.status] || BADGE.Draft
              }`}
            >
              {f.status}
            </span>

            {f.number && (
              <span className="text-xs font-semibold text-primary">
                No. {f.number}
              </span>
            )}
          </div>

          <p className="line-clamp-2 text-sm font-medium leading-relaxed group-hover:text-primary">
            {f.questionOromo}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 text-xs text-muted sm:flex-col sm:items-end">
          <span>{formatDate(f.createdAt)}</span>
          <span className="text-primary transition group-hover:translate-x-1">
            Laali
          </span>
        </div>
      </Link>
    </li>
  );
}

async function Dashboard() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  await connectDB();

  const [pending, drafts, publishedCount] = await Promise.all([
    Fatwa.countDocuments({ status: "Pending" }),
    Fatwa.countDocuments({ status: "Draft" }),
    Fatwa.countDocuments({ status: "Published" }),
  ]);

  const [inbox, published] = await Promise.all([
    Fatwa.find({ status: { $in: ["Pending", "Draft"] } })
      .sort({ createdAt: -1 })
      .limit(30)
      .select("questionOromo status number createdAt")
      .lean(),

    Fatwa.find({ status: "Published" })
      .sort({ number: -1 })
      .limit(20)
      .select("questionOromo status number createdAt")
      .lean(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
              Al
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Al-Fataawaa</h1>
              <p className="text-xs text-muted">Dr Jibriil Qamar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-block">
              ● Admin
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* Welcome */}
        <section className="mt-8">
          <h2 className="text-sm font-medium text-primary">ADMIN</h2>

          <p className="mt-2 text-sm text-muted">
            Weebsaayitii kee to'achuuf, qajeelfama fi gaaffilee haaraaf
            fatwaalee maxxanfaman ilaaluuf.
          </p>
        </section>

        {/* Statistics */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Deebii Eegataa kan jiran"
            value={pending}
            icon="⏳"
            color="bg-amber-50"
          />
          <Stat
            label="Kan yeroof olkaa'ame"
            value={drafts}
            icon="📝"
            color="bg-gray-100"
          />
          <Stat
            label="Published Fatwas"
            value={publishedCount}
            icon="📚"
            color="bg-emerald-50"
          />
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Weebsaayitii kee irratti </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span className="text-2xl">{action.icon}</span>
                <h3 className="mt-4 text-sm font-bold group-hover:text-primary">
                  {action.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {action.description}
                </p>
                <p className="mt-4 text-xs font-semibold text-primary">Seeni</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Inbox */}
        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Ergaa Haaraa</h2>
              <p className="mt-1 text-sm text-muted">
                Gaafilee haaraa ergamanii deebii eeggataa jiran
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {pending + drafts} dha.
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {inbox.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <span className="text-3xl">📭</span>
                <p className="mt-3 font-bold text-lg">0 dha.</p>
                <p className="mt-1 text-sm text-black">
                  Gaafiin haaraan ergame hin jiru.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {inbox.map((f) => (
                  <FatwaRow key={String(f._id)} f={f} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Published Fatwas */}
        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                Fatwaalee haaraa Maxxanfaman
              </h2>
              <p className="mt-1 text-sm text-muted"></p>
            </div>
            <Link
              href="/admin/fatwas?status=Published"
              className="text-sm font-medium text-primary hover:underline"
            >
              {publishedCount} maxxanfaman. Hunda ilaali
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {published.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <span className="text-3xl">📚</span>
                <p className="mt-3 font-medium">No published Fatwas yet</p>
                <p className="mt-1 text-sm text-muted">
                  Fatwaaleen maxxanfaman hin jiran.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {published.map((f) => (
                  <FatwaRow key={String(f._id)} f={f} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border py-6 text-center text-xs text-muted">
          Al-Fataawaa Afaan oromoo | Dr Jibriil Qamar | 2026
        </footer>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-center text-sm text-muted">
          Loading...
        </p>
      }
    >
      <Dashboard />
    </Suspense>
  );
}