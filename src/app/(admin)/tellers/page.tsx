import { checkSession } from "@/components/utils/Authenticator";
import React from "react";

const page = async () => {
  const session = await checkSession();
  return <div>page</div>;
};

export default page;
