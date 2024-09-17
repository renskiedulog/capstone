import { checkSession } from "@/components/utils/Authenticator";
import BoatTable from "./BoatTable";
import { redirect } from "next/navigation";
import { Boat } from "@/lib/types";
import { fetchBoats } from "@/lib/api/boatActions";

export const metadata = {
  title: "Boats",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const initBoats = await fetchBoats();

  return <BoatTable initData={initBoats} />;
};

export default page;
