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
      className='grid justify-center w-[50rem] grid-cols-2 text-primary-800'
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
      {/* <fieldset>
        <legend>Choose which service to search:</legend>
        <div className='radio-wrapper'>
          <input
            type='radio'
            name='service'
            value='discogs'
            id='discogs'
            defaultChecked
          />
          <label htmlFor='discogs'>Discogs (recommended)</label>
        </div>
        <div className='radio-wrapper'>
          <input type='radio' name='service' value='spotify' id='spotify' />
          <label htmlFor='spotify'>Spotify</label>
        </div>
        <div className='radio-wrapper'>
          <input type='radio' name='service' value='lastfm' id='lastfm' />
          <label htmlFor='lastfm'>LastFM</label>
        </div>
        <div className='radio-wrapper'>
          <input
            type='radio'
            name='service'
            value='musicbrainz'
            id='musicbrainz'
          />
          <label htmlFor='musicbrainz'>Musicbrainz</label>
        </div>
      </fieldset> */}
      <label htmlFor='search' className='w-full col-span-2 pb-5'>
        Use the dropdown to search for a band by service:
      </label>
      <input
        placeholder='Search for a band...'
        type='text'
        className='px-5 py-3 bg-primary-200 text-primary-800 shadow-sm rounded-sm'
        id='search'
        name='search'
        defaultValue={defaultValues.search} // Uncontrolled input
        required
      />
      {/* <select
        name='service'
        id='service'
        className='w-28'
        defaultValue={defaultValues.service} // Uncontrolled select
      >
        <option value='discogs' key='discogs'>
          Discogs
        </option>
        <option value='spotify' key='spotify' className='text-green-600'>
          Spotify
        </option>
        <option value='lastfm' key='lastfm'>
          LastFM
        </option>
        <option value='musicbrainz' key='musicbrainz'>
          MusicBrainz
        </option>
      </select> */}
      <SubmitButton pendingLabel='Finding Bands...'>
        Search for a band
      </SubmitButton>
    </form>
  );
}
