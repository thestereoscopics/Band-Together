"use client";

import { updateUser } from "@/app/_lib/data-service";
import SubmitButton from "@/app/_components/ui/SubmitButton";
import { toast } from "react-hot-toast";

export default function UpdateProfileForm({ user }) {
  const { fullName, email, vanityName } = user;
  async function handleUpdate(formData) {
    try {
      await updateUser(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(`Update failed. Please try again. ${error}`);
    }
  }
  return (
    <form
      action={handleUpdate}
      className='bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col'
    >
      <div className='space-y-2'>
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name='fullName'
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        />
      </div>

      <div className='space-y-2'>
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name='email'
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='vanityName'>User Name</label>
        <input
          name='vanityName'
          defaultValue={vanityName}
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
        />
      </div>

      <div className='flex justify-end items-center gap-6'>
        <SubmitButton pendingLabel='Updating...'>Update profile</SubmitButton>
      </div>
    </form>
  );
}
