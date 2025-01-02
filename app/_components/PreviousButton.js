"use client";
import { setPagination } from "@/app/_lib/data-service";

export default function PreviousButton({ paginationURL }) {
  function handleClick() {
    setPagination(paginationURL);
  }
  return <button onClick={handleClick}>Previous</button>;
}
