import {
  checkSession,
  redirectToTeller,
} from "@/components/utils/Authenticator";
import React from "react";

const page = async () => {
  let session = await checkSession();
  if (!session) return redirect("/login");
  redirectToTeller(session?.user?.isAdmin as boolean);
  return <div>page</div>;
};

export default page;
