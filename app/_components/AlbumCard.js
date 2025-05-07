// import CarouselImageBox from "@/app/_components/carousel/CarouselImageBox";
import placeholder from "@/public/placeholder.webp";
import Image from "next/image";
import Link from "next/link";

export default function AlbumCard({
  discogsReleaseData,
  spotifyAlbums,
  title,
  type,
}) {
  const filteredAlbums = discogsReleaseData.filter((album) =>
    type === "master"
      ? album.type === "master" &&
        spotifyAlbums.some((s) =>
          s
            .toLowerCase()
            .trim()
            .replace(/[^0-9a-z-A-Z ]/g, "")
            .replace(/ +/, " ")
            .includes(
              album.title
                .toLowerCase()
                .trim()
                .replace(/[^0-9a-z-A-Z ]/g, "")
                .replace(/ +/, " ")
            )
        )
      : !spotifyAlbums.some((s) =>
          s
            .trim()
            .replace(/[^0-9a-z-A-Z ]/g, "")
            .replace(/ +/, " ")
            .includes(
              album.title
                .toLowerCase()
                .trim()
                .replace(/[^0-9a-z-A-Z ]/g, "")
                .replace(/ +/, " ")
            )
        )
  );

  const slides = filteredAlbums.map((album) => ({
    id: album.id,
    artist: album.artist,
    uri: album.thumb || placeholder,
    title: album.title,
    year: album.year,
    format: album.format,
    label: album.label,
    resource_url: album.resource_url,
  }));

  return (
    <div className='w-full max-w-6xl mx-auto'>
      <h3 className='text-2xl font-semibold text-accent-400 mb-6'>{title}</h3>
      <ul className='grid grid-cols-[repeat(auto-fill,minmax(40%,1fr))] xs:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4 justify-center'>
        {slides.map(({ id, uri, title, year }) => (
          <li
            key={id}
            className='flex flex-col items-center w-full mx-auto text-center text-white'
          >
            <Link
              href={`/album/${id}`}
              className='block w-full aspect-square relative rounded-md overflow-hidden border border-primary-800 hover:bg-accent-600 transition-all'
            >
              <Image
                src={uri}
                alt={`Album: ${title}`}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 225px'
                className='object-cover'
              />
            </Link>
            <div className='mt-2'>
              <p className='text-sm font-medium line-clamp-2'>
                {title} {year && `(${year})`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
