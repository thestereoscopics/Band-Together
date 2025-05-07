"use client";
import SearchedBandList from "@/app/_components/SearchedBandList";
import MegaInput from "@/app/_components/MegaInput";
import { useState } from "react";

export default function SearchRenderBands() {
  const [bandQuery, setBandQuery] = useState(null);
  const [favoritesList, setFavoritesList] = useState(null);

  return (
    <div className='max-w-4xl mx-auto mt-12 flex flex-col items-center gap-8 px-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-accent-400 mb-2'>
          Band Together
        </h1>
        <p className='text-lg text-primary-500'>
          A place to keep track of all the bands you love.
        </p>
      </div>

      <MegaInput
        onSetBandQuery={setBandQuery}
        onSetFavoritesList={setFavoritesList}
      />
      <SearchedBandList bandQuery={bandQuery} favoritesList={favoritesList} />
    </div>
  );
}
