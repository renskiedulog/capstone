import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import StatCards from "./StatCards";
import { DollarSign } from "lucide-react";
import QueuedTable from "./QueuedTable";
import LineChart from "./LineChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PieChart from "./PieChart";

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
      <div className="grid grid-cols-1 lg:grid-cols-[65%,35%] gap-2">
        <div className="flex flex-col gap-5 z-10">
          <StatCards data={cards} />
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>
                The total number of registered users on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart className="aspect-[1/0.4]" />
            </CardContent>
          </Card>
          <QueuedTable />
        </div>
        <div className="">
          <Card className="z-10">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>
                The total number of registered users on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <PieChart />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
};

export default page;
