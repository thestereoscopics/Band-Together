import { auth } from "../_lib/auth";
import NavigationLinks from "@/app/_components/NavigationLinks";

export default async function Navigation() {
  const session = await auth();
  console.log(session);
  return <NavigationLinks session={session} />;
}
