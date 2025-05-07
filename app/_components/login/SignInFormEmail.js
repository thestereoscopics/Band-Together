"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/account" });
    setSent(true);
  };

  return (
    <div className='flex flex-col items-center mt-10 gap-8'>
      {!sent ? (
        <form
          onSubmit={handleEmailSignIn}
          className='flex flex-col gap-4 w-full max-w-sm'
        >
          <input
            type='email'
            required
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border rounded'
          />
          <button
            type='submit'
            className='px-4 py-2 bg-portfolio-600 text-white rounded hover:bg-portfolio-700'
          >
            Send Magic Link
          </button>
        </form>
      ) : (
        <p className='text-center'>
          Check your email for a magic link to sign in!
        </p>
      )}
    </div>
  );
}
