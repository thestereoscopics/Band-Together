import Image from "next/image";
import Link from "next/link";
import { getDiscogsAlbum } from "@/app/_lib/data-service";
export default async function Page({ params }) {
  const { albumId } = await params;
  const { albumData } = await getDiscogsAlbum(albumId);
  console.log(albumData);
  return (
    <div className='p-6 bg-primary-900 rounded-lg shadow-lg max-w-3xl mx-auto text-primary-100'>
      {albumData?.images.length && albumData.images[0]?.uri && (
        <div className='mb-4'>
          <Image
            src={albumData.images[0].uri}
            alt={`${albumData.title} cover`}
            width={albumData.images[0].width}
            height={albumData.images[0].height}
            className='rounded-md'
          />
        </div>
      )}
      <h1 className='text-2xl font-bold mb-2'>{albumData.title}</h1>
      <p className='text-lg mb-2'>
        by{" "}
        <Link
          href={albumData.artists[0]?.resource_url}
          target='_blank'
          className='text-accent-400 hover:underline'
        >
          {albumData.artists[0]?.name}
        </Link>
      </p>
      <p className='mb-2'>
        {albumData.year} • {albumData.genres.join(", ")} •{" "}
        {albumData.styles.join(", ")}
      </p>

      <div className='mb-4'>
        <h2 className='text-xl font-semibold mb-2'>Tracklist:</h2>
        <ol className='list-decimal pl-5 space-y-1'>
          {albumData.tracklist.map((track) => (
            <li key={track.position}>
              <span className='font-medium'>{track.title}</span> —{" "}
              {track.duration}
            </li>
          ))}
        </ol>
      </div>

      {albumData.videos?.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Videos:</h2>
          <div className='space-y-4'>
            {albumData.videos.map((video) =>
              video.embed ? (
                <div key={video.uri} className='flex flex-col gap-2'>
                  <p className='font-medium'>{video.title}</p>
                  <iframe
                    width='100%'
                    height='315'
                    src={video.uri.replace("watch?v=", "embed/")}
                    title={video.title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='rounded-md'
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      <div className='mt-4 flex gap-4'>
        <Link
          href={albumData.uri}
          target='_blank'
          className='text-accent-400 hover:underline'
        >
          View on Discogs
        </Link>
        <span>|</span>
        <Link
          href={albumData.versions_url}
          target='_blank'
          className='text-accent-400 hover:underline'
        >
          See Versions
        </Link>
      </div>
    </div>
  );
}
