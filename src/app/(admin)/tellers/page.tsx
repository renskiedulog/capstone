import { Button } from "@/components/ui/button";
import { checkSession } from "@/components/utils/Authenticator";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Tellers",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  return (
    <div>
      <Button>
        <Link href="/tellers/add-teller">Add Account</Link>
      </Button>
    </div>
  );
};

export default page;
