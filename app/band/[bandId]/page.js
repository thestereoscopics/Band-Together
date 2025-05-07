import { getArtist, getFavorite } from "@/app/_lib/data-service";
import Image from "next/image";
import ImageListContainer from "@/app/_components/ImageListContainer";
import MembersList from "@/app/_components/MembersList";
import LinksList from "@/app/_components/LinksList";
import AlbumCard from "@/app/_components/AlbumCard";
import FavoriteBandButton from "@/app/_components/ui/FavoriteBandButton";

export default async function Page({ params }) {
  const OPTIONS = { slidesToScroll: "auto" };
  const { bandId } = await params;
  const bandIdArray = bandId.split("-");
  const isFavorite = await getFavorite(bandIdArray[1]);

  const {
    spotifyArtistData,
    discogsArtistData,
    releases: discogsReleaseData,
    spotifyAlbums,
  } = await getArtist(bandIdArray[0], bandIdArray[1], bandIdArray[2]);

  const spotifyImage =
    spotifyArtistData.images[0].url || spotifyArtistData.images[0].uri;

  return (
    <div className='max-w-6xl mx-auto px-4'>
      {/* Header */}
      <section className='pt-8 pb-4 text-center'>
        <h2 className='text-4xl font-bold text-gray-200'>
          {spotifyArtistData.name}
        </h2>
      </section>

      {/* Profile & Bio */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start py-8'>
        <div className='flex flex-col items-center space-y-4'>
          {/* Artist Image */}
          <div className='relative w-48 h-48 rounded-full overflow-hidden shadow-lg'>
            {/* …Image… */}
            <Image
              src={spotifyImage}
              alt={`Band: ${spotifyArtistData.name}`}
              fill
              sizes='300px'
              priority
              className='object-cover'
            />
          </div>
          {/* Favorite Button */}
          <FavoriteBandButton
            imageURL={spotifyImage}
            id={bandIdArray[1]}
            name={spotifyArtistData.name}
            isFavorite={isFavorite ? true : false}
            isButton={true}
          />
        </div>
        <div className='md:col-span-2 space-y-6 text-gray-100'>
          {discogsArtistData.profile && <p>{discogsArtistData.profile}</p>}
          {/* optionally other bio fields */}
        </div>
      </section>

      {/* Members & Links */}
      <section className='grid grid-cols-1 sm:grid-cols-2 gap-12 py-8'>
        {discogsArtistData?.members && (
          <div>
            <MembersList discogsArtistData={discogsArtistData} />
          </div>
        )}
        {discogsArtistData?.urls && (
          <div>
            <LinksList discogsArtistData={discogsArtistData} />
          </div>
        )}
      </section>

      {/* Artist Images */}
      <section className='py-8'>
        {discogsArtistData?.images && (
          <ImageListContainer
            discogsArtistData={discogsArtistData}
            options={OPTIONS}
          />
        )}
      </section>

      {/* Releases */}
      <section className='py-8 space-y-12'>
        {discogsReleaseData?.length ? (
          <>
            {/* Major Releases */}
            <AlbumCard
              discogsReleaseData={discogsReleaseData}
              title='Major Releases'
              type='master'
              spotifyAlbums={spotifyAlbums}
            />

            {/* Other Releases */}
            <AlbumCard
              discogsReleaseData={discogsReleaseData}
              title='Other Releases (Compilations, Singles, etc)'
              type='other'
              spotifyAlbums={spotifyAlbums}
            />
          </>
        ) : (
          <p className='text-center text-gray-500'>No releases found</p>
        )}
      </section>
    </div>
  );
}
