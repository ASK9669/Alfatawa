'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <ul className="-mx-2 flex gap-1 overflow-x-auto">
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`block whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium ${
                active ? 'bg-primary text-white' : 'hover:bg-primary/10'
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}