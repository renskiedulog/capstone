import BoatTable from "@/app/(admin)/admin/boats/BoatTable";
import { checkSession } from "@/components/utils/Authenticator";
import { fetchBoats } from "@/lib/api/boatActions";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Boats",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  const initBoats = await fetchBoats();

  return session && <BoatTable initData={initBoats} />;
};

export default page;
