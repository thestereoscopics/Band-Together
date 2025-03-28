"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { name: "Bands", href: "/bands" },
  { name: "About", href: "/about" },
  { name: "Profile", href: "/account" },
];

export default function NavigationLinks({ session }) {
  const pathname = usePathname();

  return (
    <nav className='z-10 text-xl'>
      <ul className='flex gap-16 items-center'>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`hover:text-accent-400 transition-colors flex items-center gap-4 ${
                pathname === link.href ? "text-accent-400" : ""
              }`}
              href={link.href}
            >
              {link.name === "Profile" && session !== null && (
                <Image
                  className='h-8 rounded-full'
                  width={32}
                  height={32}
                  src={session.user.image}
                  alt={session.user.name}
                  referrerPolicy='no-referrer'
                />
              )}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// can you create a portfolio site with a home page with sections for about, experience, projects, skills, and contact. Then a separate page for /surprise. Each section and the other page should be in the nav. The nav should scroll to the section if on home page or if on surprise go home then scroll to the section. This is for Jeremy Sell, Senior Frontend Engineer. Using React, Next.js, Tailwind
