import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function LinksList({ discogsArtistData }) {
  if (!discogsArtistData?.urls?.length) return null;

  return (
    <div className='mt-6'>
      <h3 className='text-2xl font-semibold text-accent-400'>Links</h3>
      <ul className='space-y-2'>
        {discogsArtistData.urls.map((url) => {
          const [text, href] = url.split(" - ");
          return (
            <li key={url}>
              <Link
                href={href || text}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors group'
              >
                <ArrowTopRightOnSquareIcon className='w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-transform transform group-hover:rotate-45' />
                <span className='truncate'>{text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
