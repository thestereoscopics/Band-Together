import { auth } from "@/app/_lib/auth";
import { getUser } from "@/app/_lib/data-service";

export const metadata = {
  title: "Guest Account",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user?.email);

  const getFirstName = () => {
    if (user?.vanityName) return user.vanityName;
    if (session?.user?.name) return session.user.name.split(" ")[0];
    if (session?.user?.email) return session.user.email;
    return "Guest";
  };

  return (
    <h2 className='font-semibold text-2xl text-accent-400 mb-7'>
      Welcome, {getFirstName()}
    </h2>
  );
}
