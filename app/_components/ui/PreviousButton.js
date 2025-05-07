// "use client";
// import { setPagination } from "@/app/_lib/data-service";

// export default function PreviousButton({ paginationURL }) {
//   function handleClick() {
//     setPagination(paginationURL);
//   }
//   return <button onClick={handleClick}>Previous</button>;
// }
"use client";
import Button from "@/app/_components/ui/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function PreviousButton({ paginationURL, onPageChange }) {
  return (
    <Button
      onClick={() => onPageChange(paginationURL)}
      disabled={!paginationURL}
      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
    >
      <ArrowLeftIcon className='mr-2 h-4 w-4' /> Previous
    </Button>
  );
}
