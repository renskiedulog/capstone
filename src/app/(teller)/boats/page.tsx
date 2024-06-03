import React from "react";
import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

import BoatTable from "./BoatTable";

export const metadata = {
  title: "Boats",
};

const page = async () => {
  const session = await checkSession();
  redirectToAdmin(session?.role);
  return (
    <div>
      <BoatTable />
    </div>
  );
};

export default page;
