import { Suspense } from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import { SITE_NAME, LINKS } from '@/lib/site';

// shown for an instant while the browser works out which page is open
function PlainLinks() {
  return (
    <ul className="-mx-2 flex gap-1 overflow-x-auto">
      {LINKS.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="block whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium hover:bg-primary/10"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-surface">
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-2 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:pb-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          {SITE_NAME}
        </Link>
        <nav aria-label="Main menu" className="mt-2 sm:mt-0">
          <Suspense fallback={<PlainLinks />}>
            <NavLinks links={LINKS} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
