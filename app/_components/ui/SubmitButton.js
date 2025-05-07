"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      className='px-5 py-3 bg-accent-400 text-white font-medium rounded-md shadow-md hover:bg-accent-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400'
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
