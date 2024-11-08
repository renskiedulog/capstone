import NotFound from "@/app/not-found";
import { checkSession } from "@/components/utils/Authenticator";
import { fetchByStatus, fetchSailDetails } from "@/lib/api/queue";
import { redirect } from "next/navigation";
import QueueHistoryTable from "./QueueHistoryTable";

const page = async ({
  searchParams,
}: {
  searchParams: { status: string; id: string };
}) => {
  const { status, id } = searchParams;
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!status && status !== "completed" && status !== "canceled")
    return <NotFound />;

  return (
    <QueueHistoryTable
      initData={await fetchByStatus(status)}
      sailInfo={id ? await fetchSailDetails(id) : null}
    />
  );
};

export default page;
