"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import placeholder from "@/public/placeholder.webp";
// import Link from "next/link";

function SpotifySearch({ band }) {
  const { name, image } = band;
  const [isFavorite, setIsFavorite] = useState(false);
  const [sendArtistID, setSendArtistID] = useState("");

  function handleClick() {
    setIsFavorite(!isFavorite);
    setSendArtistID(() => (band.mbid !== "" ? band.mbid : band.url));
  }
  const imageURL =
    // "https://lastfm.freetls.fastly.net/i/u/ar0/820244be61ecdf38505ffbd0c1714657.jpg";
    image?.length > 1 ? image[1]["#text"] : placeholder;

  return (
    <li className='flex border-primary-800 flex-[1_1_200px] border relative aspect-square rounded-md overflow-hidden max-w-xs'>
      <div className='flex-1 relative'>
        <Image
          src={imageURL}
          alt={`Band: ${name}`}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover flex-1'
        />
      </div>
      <div className='absolute flex bottom-0 bg-slate-800/[.8] w-full text-center items-center justify-between py-2 px-2'>
        <p>{name}</p>
        <button className='w-4 h-auto text-red-400' onClick={handleClick}>
          <HeartIcon className={`${isFavorite ? "fill-red-400" : ""}`} />
        </button>
        <p>{sendArtistID}</p>
      </div>
    </li>
  );
}

export default SpotifySearch;
