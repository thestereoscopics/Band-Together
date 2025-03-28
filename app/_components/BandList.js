// import { unstable_noStore as noStore } from "next/cache";
"use client";
import DiscogsSearch from "@/app/_components/DiscogsSearch";
import SpotifySearch from "@/app/_components/SpotifySearch";
import MusicbrainzSearch from "@/app/_components/MusicbrainzSearch";
import LastfmSearch from "@/app/_components/LastfmSearch";
import NextButton from "@/app/_components/NextButton";
import PreviousButton from "@/app/_components/PreviousButton";

/**
 * @function BandList
 * @description A component that displays a list of bands based on a search query.
 * @param {Object} bandQuery - An object containing the search query and service name.
 * @property {string} service - The name of the service used to fetch the bands.
 * @property {Object} bandInfo - An object containing the search results.
 * @property {Array} bandInfo.results - An array of band objects.
 * @property {Object} bandInfo.pagination - An object containing pagination URLs.
 * @property {string} bandInfo.pagination.urls.next - The URL to fetch the next page of results.
 * @property {string} bandInfo.pagination.urls.last - The URL to fetch the previous page of results.
 * @returns {ReactElement} A React element representing the list of bands.
 * @example
 * <BandList bandQuery={{ service: 'discogs', bandQuery: 'The Beatles' }} />
 */
export default function BandList({ bandQuery }) {
  if (bandQuery === null || bandQuery?.message?.includes("Invalid con"))
    return null;
  const { serviceName, bandInfo } = bandQuery;
  return (
    <div>
      <ul className='w-full flex gap-8 flex-wrap lg:gap-12 xl:gap-14'>
        {serviceName === "discogs" &&
          bandInfo?.results.map((band) => (
            <DiscogsSearch band={band} key={band.id} />
          ))}
        {serviceName === "musicbrainz" &&
          bandInfo?.artists?.map((band) => (
            <MusicbrainzSearch band={band} key={band.id} />
          ))}
        {serviceName === "spotify" &&
          bandInfo?.artists?.items.map((band) => (
            <SpotifySearch band={band} key={band.id} />
          ))}
        {serviceName === "lastfm" &&
          bandInfo?.results?.artistmatches?.artist?.map((band) => (
            <LastfmSearch
              band={band}
              key={band.mbid !== "" ? band.mbid : band.url}
            />
          ))}
      </ul>
      <div className='page-navigation'>
        <PreviousButton paginationURL={bandInfo?.pagination?.urls?.last} />
        <NextButton paginationURL={bandInfo?.pagination?.urls?.next} />
      </div>
    </div>
  );
}
