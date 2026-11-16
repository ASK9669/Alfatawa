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
              className={`block whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium ${
                active ? 'bg-primary/45  border border-t-4 border-l-4 border-green-500 text-black' : 'hover:bg-primary/10' + ' hover:border hover:border-green-500 hover:border-t-5'
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