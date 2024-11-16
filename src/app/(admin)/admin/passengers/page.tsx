import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import PassengerTable from "./PassengerTable";
import { fetchAllPassengers } from "@/lib/api/passenger";

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard");

  const allPassengers = await fetchAllPassengers();

  return <PassengerTable initData={allPassengers} />;
};

export default page;
