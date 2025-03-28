import { getArtist } from "@/app/_lib/data-service";
import Image from "next/image";
import ImageListContainer from "@/app/_components/ImageListContainer";
import MembersList from "@/app/_components/MembersList";
import LinksList from "@/app/_components/LinksList";
import AlbumCard from "@/app/_components/AlbumCard";

export default async function Page({ params }) {
  const OPTIONS = { slidesToScroll: "auto" };
  const { bandId } = await params;

  const {
    spotifyArtistData,
    discogsArtistData,
    releases: discogsReleaseData,
    spotifyAlbums,
  } = await getArtist(
    bandId.split("-")[0],
    bandId.split("-")[1],
    bandId.split("-")[2]
  );

  return (
    <div className='max-w-6xl mx-auto mt-8 px-4'>
      {/* Header */}
      <h2 className='text-4xl font-bold text-center mb-8 text-gray-800'>
        {spotifyArtistData.name}
      </h2>

      {/* Artist Image */}
      {spotifyArtistData.images && (
        <div className='flex justify-center mb-8'>
          <div className='relative w-48 h-48 rounded-full overflow-hidden shadow-md hover:shadow-lg transition'>
            <Image
              src={
                spotifyArtistData.images[0].url ||
                spotifyArtistData.images[0].uri
              }
              alt={`Band: ${spotifyArtistData.name}`}
              fill
              priority
              className='object-cover'
            />
          </div>
        </div>
      )}

      {/* Artist Bio */}
      <div className='space-y-6'>
        {discogsArtistData?.profile && (
          <p className='text-lg leading-relaxed text-gray-700'>
            {discogsArtistData.profile}
          </p>
        )}

        {discogsArtistData?.realname && (
          <p className='font-semibold text-gray-800'>
            Birth name:{" "}
            <span className='text-gray-600'>{discogsArtistData.realname}</span>
          </p>
        )}

        {/* Members List */}
        {discogsArtistData?.members && (
          <div>
            <MembersList discogsArtistData={discogsArtistData} />
          </div>
        )}

        {/* Links */}
        {discogsArtistData?.urls && (
          <div>
            <LinksList discogsArtistData={discogsArtistData} />
          </div>
        )}

        {/* Additional Images */}
        {discogsArtistData?.images && (
          <ImageListContainer
            discogsArtistData={discogsArtistData}
            options={OPTIONS}
          />
        )}
      </div>

      {/* Major Releases */}
      {discogsReleaseData?.length > 0 && (
        <div className='mt-12 space-y-8'>
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
        </div>
      )}

      {/* No Releases Message */}
      {discogsReleaseData?.length === 0 && (
        <p className='text-center text-gray-500 mt-12'>No releases found</p>
      )}
    </div>
  );
}
