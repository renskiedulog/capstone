import {
  checkSession,
} from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if(session?.user?.isAdmin as boolean) redirect("/admin"); //! 3. Avoid Admin From Accessing Teller Page

  return session && <div>page</div>;
};

export default page;
