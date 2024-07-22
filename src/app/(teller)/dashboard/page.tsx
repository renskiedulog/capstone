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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPieChart } from "./DashboardPieChart";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col gap-2 z-10">
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
        <div className="space-y-2">
          <DashboardPieChart />
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Current Queue</CardTitle>
              <CardDescription className="text-lg">SS Majestic</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Concurrent Time:</div>
                <div>45 minutes</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Passengers:</div>
                <div>342 / 500</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Departure:</div>
                <div>4:30 PM</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Destination:</div>
                <div>New York City</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Status:</div>
                <div className="bg-green-500 px-2 py-1 text-white rounded-md text-foreground">
                  Boarding
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
};

export default page;
