"use client";
import Button from "@/app/_components/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function NextButton({ paginationURL, onPageChange }) {
  return (
    <Button
      onClick={() => onPageChange(paginationURL)}
      disabled={!paginationURL}
      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
    >
      Next <ArrowRightIcon className='ml-2 h-4 w-4' />
    </Button>
  );
}
