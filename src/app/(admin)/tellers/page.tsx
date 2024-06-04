import {
  checkSession,
  redirectToTeller,
} from "@/components/utils/Authenticator";
import React from "react";

const page = async () => {
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToTeller(session?.user?.isAdmin as boolean);
  return <div>page</div>;
};

export default page;
