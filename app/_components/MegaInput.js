"use client";

import useSWR from "swr";
import { searchBands } from "@/app/_lib/data-service";
import SubmitButton from "@/app/_components/ui/SubmitButton";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const swrFetcher = ([_key, query]) => searchBands(query);

export default function MegaInput({ onSetBandQuery, onSetFavoritesList }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [inputValue, setInputValue] = useState(query);

  const { data, isLoading, error } = useSWR(
    query ? ["searchBands", query] : null, // Only trigger the search when `query` is set
    swrFetcher
  );

  useEffect(() => {
    if (!data) return;
    onSetBandQuery(() => data.bandQuery);
    onSetFavoritesList(() => data.favoritesList);
  }, [data, onSetBandQuery, onSetFavoritesList]);

  useEffect(() => {
    // Clear the form when the query parameter is removed from the URL
    if (!searchParams.get("query")) {
      setInputValue("");
      setQuery("");
      onSetBandQuery("");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    const searchQuery = inputValue.trim(); // Use the input value for the search
    setQuery(searchQuery); // Update the query, triggering the SWR hook
    router.push(`/?query=${encodeURIComponent(searchQuery)}`); // Update the URL
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update input state on each keystroke
  };

  return (
    <form
      className='flex flex-col gap-4 w-full max-w-lg'
      onSubmit={handleSubmit}
    >
      <label htmlFor='search' className='text-primary-500 text-sm'>
        Search for a band:
      </label>
      <input
        type='text'
        id='search'
        name='search'
        placeholder='Search for a band...'
        value={inputValue} // Bind the input field to the inputValue state
        onChange={handleInputChange} // Update inputValue on keystroke
        required
        className='px-5 py-3 bg-primary-100 text-primary-800 rounded-md shadow-md border border-primary-300 focus:outline-none focus:ring-2 focus:ring-accent-400'
      />
      <SubmitButton pendingLabel={isLoading ? "Finding Bands..." : "Search"}>
        Search
      </SubmitButton>
      {error && <p className='text-red-500'>Error loading bands.</p>}
    </form>
  );
}
