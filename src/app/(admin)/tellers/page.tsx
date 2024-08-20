import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import React from "react";
import TellerTable from "./TellerTable";

export const metadata = {
  title: "Tellers",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const req = await fetch(`${process.env.NEXTAUTH_URL}/api/teller`, {
    method: "GET",
    next: { tags: ["tellers"] },
  });
  const res = await req?.json() ?? [];

  return <TellerTable data={res.data} />;
};

export default page;
