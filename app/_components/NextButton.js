"use client";

import { setPagination } from "@/app/_lib/data-service";

export default function NextButton({ paginationURL }) {
  function handleClick() {
    setPagination(paginationURL);
  }
  return <button onClick={handleClick}>Next</button>;
}
