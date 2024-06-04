import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Statistics",
};

const page = async () => {
  let session = await checkSession();
  if (!session) return redirect("/login");
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return <div>page</div>;
};

export default page;
