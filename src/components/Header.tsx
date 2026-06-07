"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/launches", label: "Launches" },
  { href: "/rockets", label: "Rockets" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="black">
                <path d="M12 2C8.5 2 6 5 6 8c0 4 4 8 6 12 2-4 6-8 6-12 0-3-2.5-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              SpaceX<span className="text-zinc-400 font-light ml-1">Dashboard</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
