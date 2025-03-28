import CarouselImageBox from "@/app/_components/CarouselImageBox";
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

  console.log(discogsReleaseData);
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
      {slides.length > 3 ? (
        <CarouselImageBox
          slides={slides}
          keyName={title}
          options={{ slidesToScroll: "auto" }}
          isAlbum={true}
        />
      ) : (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {slides.map(({ id, uri, title, year, label }) => (
            <Link
              href={`/album/${id}`}
              className='border border-primary-800 relative aspect-square rounded-md overflow-hidden max-w-xs hover:bg-accent-600 transition-all hover:text-primary-900 flex flex-[1_1_200px]'
              key={id}
            >
              <li className='border border-primary-800 rounded-md shadow-md overflow-hidden p-4 flex flex-col items-start gap-2'>
                <div className='aspect-square w-full max-w-[200px] rounded-md overflow-hidden relative'>
                  <Image
                    src={uri}
                    alt={`Album: ${title}`}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover'
                  />
                </div>
                <div className='flex-grow flex flex-col gap-1 mt-2'>
                  {title ||
                    (year && (
                      <p className='text-lg font-medium'>
                        {title} - {year}
                      </p>
                    ))}
                  {label && <small className='text-primary-600'>{label}</small>}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
