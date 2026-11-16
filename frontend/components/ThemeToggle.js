'use client';

import { useEffect } from 'react';

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export default function ThemeToggle() {
  // while the visitor has made no choice, follow the phone or computer setting
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e) {
      let saved = null;
      try {
        saved = localStorage.getItem('theme');
      } catch {}
      if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'dark' : 'light');
    }
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
  }

  const icon = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Light / dark mode"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-surface hover:border-primary"
    >
      {/* moon: shown in light mode */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 dark:hidden" {...icon}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* sun: shown in dark mode */}
      <svg viewBox="0 0 24 24" className="hidden h-5 w-5 dark:block" {...icon}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    </button>
  );
}