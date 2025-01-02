"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import placeholder from "@/public/placeholder.webp";
// import Link from "next/link";

function BandCard({ band }) {
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
    <li className='flex border-primary-800 flex-[1_1_200px] border relative aspect-square rounded-md overflow-hidden'>
      <div className='flex-1 relative'>
        <Image
          src={imageURL}
          alt={`Band: ${title}`}
          fill
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
  );
}

export default BandCard;
