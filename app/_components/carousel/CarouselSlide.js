import Image from "next/image";
import placeholder from "@/public/placeholder.webp";
import Link from "next/link";

export default function CarouselSlide({ slide, keyName, isAlbum }) {
  const slideContent = (
    <div className='shadow-inner border border-primary-800 relative flex aspect-square rounded-md overflow-hidden max-w-xs'>
      <Image
        src={slide.uri || placeholder}
        alt={isAlbum ? `Album: ${slide.title}` : `Band: ${keyName}`}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='object-cover'
      />
    </div>
  );
  return (
    <div className='transform flex-none w-[100%] xs:w-[50%] sm:w-[25%] min-w-0 pl-4'>
      {isAlbum ? (
        <Link href={`/album/${slide.id}`} key={slide.id}>
          {slideContent}
          <div className='text-center mt-2'>
            {slide.title ||
              (slide.year && (
                <p className='text-lg font-medium block'>
                  {slide.title} - {slide.year}
                </p>
              ))}
            {slide.label && (
              <small className='text-primary-600 block'>
                Label: {slide.label}
              </small>
            )}
          </div>
        </Link>
      ) : (
        slideContent
      )}
    </div>
  );
}
