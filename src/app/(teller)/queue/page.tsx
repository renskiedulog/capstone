import {
  checkSession,
} from "@/components/utils/Authenticator";

import Board from "./Board";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if(session?.user?.isAdmin as boolean) redirect("/admin"); //! 3. Avoid Admin From Accessing Teller Page

  return (
    session && (
      <div className="h-screen w-full text-black">
        <Board />
      </div>
    )
  );
};

export default page;
