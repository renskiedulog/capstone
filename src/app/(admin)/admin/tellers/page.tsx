import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import React from "react";
import TellerTable from "./TellerTable";
import { fetchTellers } from "@/lib/api/tellerActions";

export const metadata = {
  title: "Tellers",
};

export const revalidate = 5;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const tellers = await fetchTellers();

  return <TellerTable initData={tellers} />;
};

export default page;
