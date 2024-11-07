import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import React from "react";
import Queue from "./QueueTable";

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  return <Queue />;
};

export default page;
