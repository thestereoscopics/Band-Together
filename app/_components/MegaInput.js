"use client";

import { searchBands } from "@/app/_lib/data-service";
import SubmitButton from "@/app/_components/SubmitButton";
import { useState } from "react";

export default function MegaInput({ onSetBandQuery }) {
  const [defaultValues, setDefaultValues] = useState({
    search: "",
    service: "spotify",
  });

  return (
    <form
      className='flex flex-col gap-4 w-full max-w-lg'
      action={async (formData) => {
        const data = Object.fromEntries(formData.entries());
        const bandInfo = await searchBands(formData);

        setDefaultValues({
          search: data.search || "",
          service: "spotify",
        });

        onSetBandQuery(() => bandInfo);
      }}
    >
      <label htmlFor='search' className='text-primary-500 text-sm'>
        Search for a band:
      </label>
      <input
        type='text'
        id='search'
        name='search'
        placeholder='Search for a band...'
        defaultValue={defaultValues.search}
        required
        className='px-5 py-3 bg-primary-100 text-primary-800 rounded-md shadow-md border border-primary-300 focus:outline-none focus:ring-2 focus:ring-accent-400'
      />
      <SubmitButton pendingLabel='Finding Bands...'>Search</SubmitButton>
    </form>
  );
}
