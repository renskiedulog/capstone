import React from "react";
import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

import BoatTable from "./BoatTable";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Boats",
};

const page = async () => {
  let session = await checkSession();
  if (!session) return redirect("/login");
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return (
    <div>
      <BoatTable />
    </div>
  );
};

export default page;
