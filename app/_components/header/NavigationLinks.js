"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { name: "Bands", href: "/bands" },
  { name: "About", href: "/about" },
  {
    altName: "Profile",
    altHref: "/account",
    name: "Log in",
    href: "/login",
  },
];

export default function NavigationLinks({ session }) {
  const pathname = usePathname();

  return (
    <nav className='z-10 text-xl'>
      <ul className='flex gap-16 items-center'>
        {navLinks.map((link) => (
          <li key={link.name}>
            {link.name === "Log in" && session !== null ? (
              <Link
                className={`hover:text-accent-400 transition-colors flex items-center gap-4 ${
                  pathname === link.altHref ? "text-accent-400" : ""
                }`}
                href={link.altHref}
              >
                {session.user.image && (
                  <Image
                    className='h-8 rounded-full'
                    width={32}
                    height={32}
                    src={session.user.image}
                    alt={session.user.name}
                    referrerPolicy='no-referrer'
                  />
                )}
                {link.altName}
              </Link>
            ) : (
              <Link
                className={`hover:text-accent-400 transition-colors flex items-center gap-4 ${
                  pathname === link.href ? "text-accent-400" : ""
                }`}
                href={link.href}
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
