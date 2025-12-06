'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Writing', path: '/writing' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 py-6">
      <ul className="flex gap-6 text-xs font-medium">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link 
              href={item.path}
              className={`transition-colors ${
                pathname === item.path 
                  ? 'text-black font-semibold' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
