import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import StatCards from "./StatCards";
import { DollarSign } from "lucide-react";
import QueuedTable from "./QueuedTable";

export const metadata = {
  title: "Dashboard",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (session?.user?.isAdmin as boolean) redirect("/admin"); //! 3. Avoid Admin From Accessing Teller Page

  const cards = [
    {
      cardTitle: "Total",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      stats: "123,123,123.12",
      info: "+40% since last month.",
    },
    {
      cardTitle: "Total",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      stats: "123,123,123.12",
      info: "+40% since last month.",
    },
    {
      cardTitle: "Total",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      stats: "123,123,123.12",
      info: "+40% since last month.",
    },
    {
      cardTitle: "Total",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      stats: "123,123,123.12",
      info: "+40% since last month.",
    },
  ];

  return (
    session && (
      <div className="flex flex-col gap-5">
        <StatCards data={cards} />
        <QueuedTable />
      </div>
    )
  );
};

export default page;
