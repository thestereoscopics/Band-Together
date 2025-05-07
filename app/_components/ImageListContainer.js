import CarouselImageBox from "@/app/_components/carousel/CarouselImageBox";
import ImageList from "@/app/_components/ImageList";

export default function ImageListContainer({ discogsArtistData, options }) {
  const images = discogsArtistData.images || [];
  if (images.length === 0) {
    return (
      <div>
        <h3 className='text-2xl font-semibold text-accent-400'>
          Artist Images
        </h3>
        <p className='text-gray-400'>No images available.</p>
      </div>
    );
  }
  const useCarousel = images.length > 4;
  return (
    <div>
      <h3 className='text-2xl font-semibold text-accent-400'>Artist Images</h3>
      <div className='w-full'>
        {useCarousel ? (
          <CarouselImageBox
            options={options}
            slides={images}
            keyName={discogsArtistData.name}
          />
        ) : (
          <ImageList images={images} name={discogsArtistData.name} />
        )}
      </div>
    </div>
  );
}
