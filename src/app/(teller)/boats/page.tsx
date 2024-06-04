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
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return (
    <div>
      <BoatTable />
    </div>
  );
};

export default page;
