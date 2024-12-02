import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import StatCards from "@/app/(teller)/dashboard/StatCards";
import { Sailboat, UserIcon } from "lucide-react";
import RecentTellers from "./RecentTellers";
import {
  getBoatCount,
  getRecentActivities,
  getRecentTellers,
  getTellerCount,
  getTotalSails,
} from "@/lib/api/common";
import Activity from "../../../components/utils/ActivityTracker";
import { ActivityTypes } from "@/lib/types";
import HorizontalCardChart, { QueueSummaryData } from "./HorizontalCardChart";
import {
  getPassengerDensity,
  getQueueInsights,
  getQueueSummary,
} from "@/lib/api/statistics";
import LineChartCard from "./LineChartCard";
import RecentBoats from "./RecentBoats";
import { getRecentBoats } from "@/lib/api/boatActions";
import ActiveSection from "@/app/(teller)/dashboard/ActiveSection";
import { getAccounts } from "@/lib/api/tellerActions";
import QueueInsightsCard from "@/app/(teller)/dashboard/Insights";

export const metadata = {
  title: "Admin Dashboard",
};

export const revalidate = 60;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const [
    tellerCount,
    recentTellers,
    activities,
    boatCount,
    totalSails,
    queueSummary,
    recentBoats,
    passengerDensity,
    accounts,
    queueInsights,
  ] = await Promise.all([
    getTellerCount(),
    getRecentTellers(),
    getRecentActivities(),
    getBoatCount(),
    getTotalSails(),
    getQueueSummary(),
    getRecentBoats(),
    getPassengerDensity(),
    getAccounts(),
    getQueueInsights(),
  ]);

  const cards = [
    {
      cardTitle: "Total Teller Accounts",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      stats: tellerCount?.totalTellersCount,
      info:
        tellerCount?.currentMonthTellersCount > 0
          ? `${tellerCount?.currentMonthTellersCount} new teller${tellerCount?.currentMonthTellersCount > 1 ? "s" : ""} this month.`
          : "No new tellers this month.",
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
    {
      cardTitle: "Total Sails",
      icon: <Sailboat className="h-4 w-4 text-muted-foreground" />,
      stats: totalSails?.totalCompletedCount,
      info:
        totalSails?.completedTodayCount > 0
          ? `${totalSails?.completedTodayCount} completed sail${totalSails?.completedTodayCount > 1 ? "s" : ""} today.`
          : "No sails today yet.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] xl:grid-cols-[70%,30%] gap-2">
      <div className="space-y-2">
        <StatCards data={cards} />
        <div className="flex lg:flex-row flex-col gap-2 mr-0 md:mr-2 xl:mr-0">
          <HorizontalCardChart initData={queueSummary as QueueSummaryData} />
          <LineChartCard initData={passengerDensity} />
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <RecentTellers data={recentTellers} />
          <RecentBoats data={recentBoats} />
        </div>
      </div>
      <div className="space-y-2">
        <QueueInsightsCard initData={queueInsights} />
        <ActiveSection accounts={accounts} />
        <Activity initData={activities as ActivityTypes[]} />
      </div>
    </div>
  );
};

export default page;
