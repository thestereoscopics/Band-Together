import SearchRenderBands from "@/app/_components/SearchRenderBands";
export default function Home() {
  return (
    <div className='flex items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]'>
      <div className='gap-8 row-start-2 items-center sm:items-start w-full'>
        <SearchRenderBands />
      </div>
    </div>
  );
}
