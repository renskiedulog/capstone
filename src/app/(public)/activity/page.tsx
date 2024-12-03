import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import React from "react";
import ActivityTable from "./ActivityTable";
import { getAllActivities } from "@/lib/api/activity";
import { ActivityTypes } from "@/lib/types";

export const metadata = {
  title: "Activity",
};

export const revalidate = 60;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  const activities = await getAllActivities();

  return <ActivityTable initData={activities as ActivityTypes[]} />;
};

export default page;
