import Link from 'next/link';
import { SITE_NAME, LINKS } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="mx-auto grid max-w-3xl gap-6 p-6 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-primary">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-muted">
           Gaafileen gaafachuuf,sagantaalee biroo aragchuufi odeeffannoo dabalataa argachuuf, marsariitii keenya daawwadhaa.
          </p>
        </div>
        <ul className="space-y-1 text-sm sm:text-right">
          {LINKS.filter((l) => l.href !== '/').map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}