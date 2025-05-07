"use client";
// import Image from "next/image";
// import logo from "@/public/banded-together-logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Logo() {
  const pathname = usePathname();
  return (
    <Link href='/' className='flex items-center gap-4 z-10'>
      {/* <Image
        height='60'
        width='auto'
        alt='Band Together logo'
        src={logo}
        quality={100}
        priority
      /> */}
      <span
        className={`text-xl font-semibold ${
          pathname === "/" ? "text-accent-400" : "text-primary-100"
        }`}
      >
        Band Together
      </span>
    </Link>
  );
}

export default Logo;
