import Link from "next/link";
import Image from "next/image";
import AboutOne from "@/public//about-1.jpg";
import AboutTwo from "@/public//about-2.jpg";

export const revalidate = 86400;
export const metadata = {
  title: "About",
};

export default async function Page() {
  return (
    <div className='grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center'>
      <div className='col-span-3'>
        <h2 className='text-4xl mb-10 text-accent-400 font-medium'>
          Welcome to Band Log
        </h2>

        <div className='space-y-8'>
          <p>some things</p>
        </div>
      </div>

      <div className='col-span-2 aspect-square relative'>
        <Image
          src={AboutOne}
          fill
          className='object-cover'
          alt='Family sitting around a fire pit in front of cabin'
          placeholder='blur'
        />
      </div>

      <div className='col-span-2 aspect-square relative'>
        <Image
          src={AboutTwo}
          fill
          className='object-cover'
          placeholder='blur'
          alt='Family that manages The Wild Oasis'
        />
      </div>

      <div className='col-span-3'>
        <h3 className='text-4xl mb-10 text-accent-400 font-medium'>
          Managed by our family since 1962
        </h3>

        <div className='space-y-8'>
          <p>
            Since 1962, The Wild Oasis has been a cherished family-run retreat.
            Started by our grandparents, this haven has been nurtured with love
            and care, passing down through our family as a testament to our
            dedication to creating a warm, welcoming environment.
          </p>
          <p>Over the years</p>

          <div>
            <Link
              href='/'
              className='inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all'
            >
              Explore some bands
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
