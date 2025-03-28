import Image from "next/image";
export default function ImageList({ images, name }) {
  return (
    <ul className='flex flex-wrap gap-4 w-full' key='image-list'>
      {images.map(({ id, uri }) => (
        <li
          key={id}
          className='flex border-primary-800 flex-[1_1_200px] border relative aspect-square rounded-md overflow-hidden max-w-xs'
        >
          <Image
            src={uri}
            alt={`Band: ${name}`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover flex-1'
          />
        </li>
      ))}
    </ul>
  );
}
