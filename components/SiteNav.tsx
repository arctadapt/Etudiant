'use client';

import { usePathname } from 'next/navigation';

const sections = [
  { href: '#menu', label: 'Menu' },
  { href: '#cara-pesan', label: 'Cara pesan' },
  { href: '#kontak', label: 'Kontak' },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Utama">
      {sections.map((section) => (
        <a key={section.href} href={pathname === '/' ? section.href : `/${section.href}`}>
          {section.label}
        </a>
      ))}
    </nav>
  );
}
