// import { unstable_noStore as noStore } from "next/cache";
"use client";
import { useEffect, useState } from "react";
import SpotifySearch from "@/app/_components/bandsearch/SpotifySearch";
import NextButton from "@/app/_components/ui/NextButton";
import PreviousButton from "@/app/_components/ui/PreviousButton";

export default function SearchedBandList({
  bandQuery: bandInfo,
  favoritesList,
}) {
  const [currentData, setCurrentData] = useState(bandInfo);
  useEffect(() => {
    setCurrentData(bandInfo);
  }, [bandInfo]);

  if (currentData === null || bandInfo?.message?.includes("Invalid con"))
    return null;

  async function handlePagination(nextPageUrl) {
    if (!nextPageUrl) return; // if there is no page URL, do nothing
    try {
      const res = await fetch(nextPageUrl);
      if (!res.ok) throw new Error("Failed to fetch next page");
      const nextData = await res.json();
      setCurrentData(nextData); // update state with new band data and pagination info
    } catch (err) {
      console.error("Error fetching page:", err);
    }
  }
  let favoriteBandIds;
  if (favoritesList !== null) {
    favoriteBandIds = new Set(favoritesList.map((fav) => fav.band_id));
  }

  return (
    <div>
      <ul className='w-full flex gap-8 flex-wrap lg:gap-12 xl:gap-14'>
        {currentData?.artists?.items.map((band) => (
          <SpotifySearch
            band={band}
            key={band.id}
            isFavorite={favoriteBandIds.has(band.id)}
          />
        ))}
      </ul>
      {currentData.artists && (
        <div className='page-navigation'>
          <PreviousButton
            paginationURL={currentData.artists?.previous}
            onPageChange={handlePagination}
          />
          <NextButton
            paginationURL={currentData.artists?.next}
            onPageChange={handlePagination}
          />
        </div>
      )}
    </div>
  );
}
