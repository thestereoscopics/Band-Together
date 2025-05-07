"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import placeholder from "@/public/placeholder.webp";
import Link from "next/link";
// import Link from "next/link";

function DiscogsSearch({ band }) {
  const { title, cover_image, thumb } = band;
  const [isFavorite, setIsFavorite] = useState(false);
  const [sendArtistID, setSendArtistID] = useState("");
  if (band.type !== "artist") return null;
  function handleClick() {
    setIsFavorite(!isFavorite);
    setSendArtistID(() => band.id);
  }
  const imageURL = thumb !== "" ? cover_image : placeholder;
  return (
    <Link
      href={`/band/dc-${band.id}`}
      className='border border-primary-800 relative aspect-square rounded-md overflow-hidden max-w-xs hover:bg-accent-600 transition-all hover:text-primary-900 flex flex-[1_1_200px]'
    >
      <li className='flex w-full'>
        <div className='flex-1 relative'>
          <Image
            src={imageURL}
            alt={`Band: ${title}`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover flex-1'
          />
        </div>
        <div className='absolute flex bottom-0 bg-slate-800/[.8] w-full text-center items-center justify-between py-2 px-2'>
          <p>{title}</p>
          <button className='w-4 h-auto text-red-400' onClick={handleClick}>
            <HeartIcon className={`${isFavorite ? "fill-red-400" : ""}`} />
          </button>
          <p>{sendArtistID}</p>
        </div>
      </li>
    </Link>
  );
}

export default DiscogsSearch;
