import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import QueueHistoryTable from "./QueueHistoryTable";
import { fetchRecentSails } from "@/lib/api/queue";
import { Queue } from "@/lib/types";

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  const recentSails = await fetchRecentSails();

  return <QueueHistoryTable initData={recentSails as Queue[]} />;
};

export default page;
