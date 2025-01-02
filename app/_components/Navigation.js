"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Bands", href: "/bands" },
  { name: "About", href: "/about" },
  { name: "Profile", href: "/account" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className='z-10 text-xl'>
      <ul className='flex gap-16 items-center'>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`hover:text-accent-400 transition-colors ${
                pathname === link.href ? "text-accent-400" : ""
              }`}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
