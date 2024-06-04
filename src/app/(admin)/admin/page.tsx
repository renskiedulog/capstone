import {
  checkSession,
  redirectToTeller,
} from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";

const page = async () => {
  let session = await checkSession();
  if (!session) return redirect("/login");
  redirectToTeller(session?.user?.isAdmin as boolean);

  return <div></div>;
};

export default page;
