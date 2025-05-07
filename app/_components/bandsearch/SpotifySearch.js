"use client";
import Image from "next/image";
import placeholder from "@/public/placeholder.webp";
import Link from "next/link";
import FavoriteBandButton from "@/app/_components/ui/FavoriteBandButton.js";

function SpotifySearch({ band, isFavorite }) {
  const { name, images, id } = band;

  if (band.type !== "artist") return null;
  const imageURL = images.length > 1 ? images[1].url : placeholder.src;

  return (
    <Link
      href={`/band/sp-${id}-${name}`}
      className='border border-primary-800 relative aspect-square rounded-md overflow-hidden max-w-xs hover:bg-accent-600 transition-all hover:text-primary-900 flex flex-[1_1_200px]'
    >
      <li className='flex w-full'>
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
          <FavoriteBandButton
            imageURL={imageURL}
            id={id}
            name={name}
            isFavorite={isFavorite}
            isButton={false}
          />
        </div>
      </li>
    </Link>
  );
}

export default SpotifySearch;
