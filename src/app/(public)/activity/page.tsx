import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import React from "react";
import ActivityTable from "./ActivityTable";
import { getAllActivities } from "@/lib/api/activity";

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  const activities = await getAllActivities();

  return <ActivityTable data={activities} />;
};

export default page;
