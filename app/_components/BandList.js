// import { unstable_noStore as noStore } from "next/cache";
"use client";
import { getBand } from "@/app/_lib/data-service";
import BandCard from "@/app/_components/BandCard";
import NextButton from "@/app/_components/NextButton";
import PreviousButton from "@/app/_components/PreviousButton";
import { useEffect, useState } from "react";

export default function BandList() {
  //makes this non cached - dynamically rendered
  //if we have partial-rendering on then this would make only this part of the page dynamic and the rest static, but without that then the whole route is dynamically rendered now.
  // noStore();
  const [bandQuery, setBandQuery] = useState(null);
  useEffect(() => {
    async function runBandQuery() {
      const bandInfo = await getBand("big th");
      // setBandQuery(() => bandInfo);
    }
    runBandQuery();
  }, []);
  console.log(bandQuery);
  if (bandQuery === null) return null;
  console.log(bandQuery);

  // async function handleNextPrevRequest(paginationURL) {
  //   let bands = await setPagination(paginationURL);
  //   console.log(bands);
  // }
  console.log(bandQuery);
  return (
    <>
      <ul className='w-full flex gap-8 flex-wrap lg:gap-12 xl:gap-14'>
        {bandQuery?.results.map((band) => (
          <BandCard band={band} key={band.id} />
        ))}
      </ul>
      <div className='page-navigation'>
        <PreviousButton paginationURL={bandQuery?.pagination?.urls?.last} />
        <NextButton paginationURL={bandQuery?.pagination?.urls?.next} />
      </div>
    </>
  );
}
