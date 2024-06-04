import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

import Board from "./Board";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  let session = await checkSession();
  if (!session) return redirect("/login");
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return (
    <div className="h-screen w-full text-black">
      <Board />
    </div>
  );
};

export default page;
