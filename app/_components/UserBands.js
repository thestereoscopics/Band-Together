"use client";

import { useState, useEffect } from "react";
import { getLikedBands } from "@/app/_lib/data-service";
import Image from "next/image";
import Link from "next/link";

export default function UserBands() {
  const [bands, setBands] = useState([]);
  const [displayBands, setDisplayBands] = useState([]);

  const [sortOrder, setSortOrder] = useState("asc");
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    const fetchBands = async () => {
      const res = await getLikedBands();
      setBands(res);
      res.sort((a, b) => a.artistName.localeCompare(b.artistName));
      setDisplayBands(res); // initialize display
    };
    fetchBands();
  }, []);

  const handleSort = (type) => {
    setSortOrder(type);
    const copy = [...bands];

    if (type === "asc") {
      copy.sort((a, b) => a.artistName.localeCompare(b.artistName));
    } else if (type === "desc") {
      copy.sort((a, b) => b.artistName.localeCompare(a.artistName));
    } else if (type === "random") {
      copy.sort(() => Math.random() - 0.5);
    }

    setDisplayBands(copy);
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <h1 className='text-3xl font-bold text-white'>My Bands</h1>
        <div className='flex space-x-2'>
          {["asc", "desc", "random"].map((option) => (
            <button
              key={option}
              onClick={() => {
                if (option === "random") {
                  setIsRolling(true);
                  handleSort("random");
                  setTimeout(() => setIsRolling(false), 600);
                } else {
                  handleSort(option);
                }
              }}
              className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                sortOrder === option
                  ? "bg-primary-600 text-background"
                  : "bg-background text-foreground hover:bg-primary-800"
              }`}
            >
              {option === "asc" && "A-Z"}
              {option === "desc" && "Z-A"}
              {option === "random" && (
                <span
                  className={`inline-block transition-transform ${
                    isRolling ? "animate-tumble-shake" : ""
                  }`}
                >
                  🎲
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {displayBands.map((band) => {
          const href = `/band/sp-${band.id}-${band.artistName}`;
          const displayName = decodeURI(decodeURI(band.artistName));

          return (
            <Link
              href={href}
              key={band.id}
              className='bg-primary-800 rounded-lg overflow-hidden text-center p-3 text-white hover:bg-primary-700 transition'
            >
              <div className='aspect-square relative w-full'>
                <Image
                  src={band.image}
                  alt={displayName}
                  sizes='200px'
                  fill
                  className='object-cover'
                />
              </div>
              <h2 className='mt-2 text-lg font-medium'>{displayName}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
