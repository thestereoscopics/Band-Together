import { auth } from "../../_lib/auth";
import NavigationLinks from "@/app/_components/header/NavigationLinks";

export default async function Navigation() {
  const session = await auth();
  return <NavigationLinks session={session} />;
}
