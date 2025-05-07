"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
// import Link from "next/link";

function DiscogsSearch({ band }) {
  const { type } = band;
  const name = band["sort-name"];
  const [isFavorite, setIsFavorite] = useState(false);
  const [sendArtistID, setSendArtistID] = useState("");
  if (type !== "Group" && type !== "Person") return null;
  function handleClick() {
    setIsFavorite(!isFavorite);
    setSendArtistID(() => band.id);
  }

  return (
    <li className='flex flex-wrap border-b-800 w-full gap-8'>
      <p>{name}</p>
      <button className='w-4 h-auto text-red-400' onClick={handleClick}>
        <HeartIcon className={`${isFavorite ? "fill-red-400" : ""}`} />
      </button>
      <p>{sendArtistID}</p>
    </li>
  );
}

export default DiscogsSearch;
