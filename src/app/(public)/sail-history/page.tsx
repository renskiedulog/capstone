import NotFound from "@/app/not-found";
import { checkSession } from "@/components/utils/Authenticator";
import { fetchByStatus, fetchSailDetails } from "@/lib/api/queue";
import { redirect } from "next/navigation";
import QueueHistoryTable from "./QueueHistoryTable";

const page = async ({
}: {
}) => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  return (
    <QueueHistoryTable
    />
  );
};

export default page;
