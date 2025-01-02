export const revalidate = 86400;
export const metadata = {
  title: "About",
};

export default async function Page() {
  return (
    <div className='grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center'>
      <div className='col-span-3'>
        <h1 className='text-4xl mb-10 text-accent-400 font-medium'>
          Find bands
        </h1>

        <div className='space-y-8'>
          <p>Look at these bands</p>
        </div>
      </div>
    </div>
  );
}
