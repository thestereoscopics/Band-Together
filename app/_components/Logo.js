"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.webp";
import { usePathname } from "next/navigation";

function Logo() {
  const pathname = usePathname();
  return (
    <Link href='/' className='flex items-center gap-4 z-10'>
      <Image
        height='60'
        width='60'
        alt='Band Log logo'
        src={logo}
        quality={100}
      />
      <span
        className={`text-xl font-semibold ${
          pathname === "/" ? "text-accent-400" : "text-primary-100"
        }`}
      >
        Band Log
      </span>
    </Link>
  );
}

export default Logo;
