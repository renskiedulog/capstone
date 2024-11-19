import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import StatCards from "./StatCards";
import {
  DollarSign,
  History,
  ListOrdered,
  ListRestart,
  Plus,
  Sailboat,
  Ship,
  ShipIcon,
} from "lucide-react";
import QueuedTable from "./QueuedTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityTracker from "@/components/utils/ActivityTracker";
import { getBoatCount, getRecentActivities } from "@/lib/api/common";
import { ActivityTypes } from "@/lib/types";
import HorizontalCardChart, {
  QueueSummaryData,
} from "@/app/(admin)/admin/HorizontalCardChart";
import {
  getBoatSailCountsByRange,
  getQueueSummary,
} from "@/lib/api/statistics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SailsPie from "./SailsPie";
import ActiveSection from "./ActiveSection";
import LastChecked from "./LastChecked";
import { getAccounts } from "@/lib/api/tellerActions";
import { getBoatsApproachingInspection } from "@/lib/api/boatActions";

export const metadata = {
  title: "Dashboard",
};

export const revalidate = 60;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (session?.user?.isAdmin as boolean) redirect("/admin"); //! 3. Avoid Admin From Accessing Teller Page

  const [
    boatCount,
    recentActivities,
    queueSummary,
    sailsPie,
    accounts,
    lastCheckedBoats,
  ] = await Promise.all([
    getBoatCount(),
    getRecentActivities(),
    getQueueSummary(),
    getBoatSailCountsByRange("today"),
    getAccounts(),
    getBoatsApproachingInspection(),
  ]);

  const cards = [
    {
      cardTitle: "Total Registered Boat",
      icon: <Sailboat className="h-4 w-4 text-muted-foreground" />,
      stats: boatCount?.totalBoatCount,
      info:
        boatCount?.currentMonthBoatsCount > 0
          ? `${boatCount?.currentMonthBoatsCount} new boat${boatCount?.currentMonthBoatsCount > 1 ? "s" : ""} this month.`
          : "No new boats registered this month.",
    },
    {
      cardTitle: "Total Registered Boat",
      icon: <Sailboat className="h-4 w-4 text-muted-foreground" />,
      stats: boatCount?.totalBoatCount,
      info:
        boatCount?.currentMonthBoatsCount > 0
          ? `${boatCount?.currentMonthBoatsCount} new boat${boatCount?.currentMonthBoatsCount > 1 ? "s" : ""} this month.`
          : "No new boats registered this month.",
    },
  ];

  return (
    session && (
      <div className="grid grid-cols-1 xl:grid-cols-[70%,30%] gap-2">
        <div className="flex flex-col gap-2 z-10">
          <div className="flex flex-col md:flex-row w-full gap-2">
            <StatCards data={cards} />
            <Card className="p-2 flex-col flex gap-2 min-h-[130px] md:min-h-0">
              <Button
                variant="outline"
                className="w-full h-1/2 p-0 overflow-hidden"
              >
                <Link
                  href="/boats"
                  className="w-full h-full flex items-center justify-center gap-1 hover:text-white hover:bg-blue-400"
                >
                  <ListOrdered size={18} className="mb-0.5" />
                  Queue
                </Link>
              </Button>
              <div className="flex items-center h-1/2 gap-2">
                <Button
                  variant="outline"
                  className="w-full h-full p-0 overflow-hidden min-w-[80px] text-xs"
                >
                  <Link
                    href="/sail-history"
                    className="w-full h-full flex items-center justify-center gap-1 hover:text-white hover:bg-blue-400"
                  >
                    <ListRestart size={15} className="mb-1" />
                    Sails
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-full p-0 overflow-hidden min-w-[80px] text-xs"
                >
                  <Link
                    href="/boats"
                    className="w-full h-full flex items-center justify-center gap-1 hover:text-white hover:bg-blue-400"
                  >
                    <ShipIcon size={15} className="mb-1" />
                    Boats
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-full p-0 overflow-hidden min-w-[80px] text-xs"
                >
                  <Link
                    href="/activity"
                    className="w-full h-full flex items-center justify-center gap-1 hover:text-white hover:bg-blue-400"
                  >
                    <History size={15} className="mb-1" />
                    Activity
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <HorizontalCardChart
              initData={queueSummary as QueueSummaryData}
              className="lg:w-[60%]"
            />
            <SailsPie initData={sailsPie} />
          </div>
          <LastChecked boats={lastCheckedBoats} />
        </div>
        <div className="md:space-y-0 space-y-2 xl:space-y-2 md:space-x-2 xl:space-x-0 relative md:flex xl:block items-start">
          <ActiveSection accounts={accounts} />
          <ActivityTracker initData={recentActivities as ActivityTypes[]} />
        </div>
      </div>
    )
  );
};

export default page;
