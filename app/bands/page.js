import UserBands from "@/app/_components/UserBands";

export const revalidate = 86400;
export const metadata = {
  title: "About",
};

export default async function Page() {
  return <UserBands />;
}
