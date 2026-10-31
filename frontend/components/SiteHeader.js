import Link from 'next/link';
import NavLinks from './NavLinks';
import { SITE_NAME, LINKS } from '@/lib/site';

export default function SiteHeader() {
  return (
    <header className="border-b bg-surface">
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-2 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:pb-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          {SITE_NAME}
        </Link>
        <nav aria-label="Main menu" className="mt-2 sm:mt-0">
          <NavLinks links={LINKS} />
        </nav>
      </div>
    </header>
  );
}