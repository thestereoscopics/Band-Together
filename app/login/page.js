import SignInFormEmail from "../_components/login/SignInFormEmail";
import SignInButton from "../_components/login/SignInButton";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className='flex flex-col gap-10 mt-10 items-center'>
      <h2 className='text-3xl font-semibold'>Sign in to access your bands</h2>
      <SignInFormEmail />
      <SignInButton />
    </div>
  );
}
