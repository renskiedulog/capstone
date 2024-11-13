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

export const metadata = {
  title: "Admin Dashboard",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const [tellerCount, recentTellers, activities, boatCount, totalSails] =
    await Promise.all([
      getTellerCount(),
      getRecentTellers(),
      getRecentActivities(),
      getBoatCount(),
      getTotalSails(),
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
          ? `${totalSails?.completedTodayCount} completed sail/s today.`
          : "No sails today yet.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[75%,25%] xl:grid-cols-[70%,30%] gap-2">
      <div className="space-y-2">
        <StatCards data={cards} />
        <RecentTellers data={recentTellers} />
      </div>

      <div className="space-y-2">
        <Activity initData={activities as ActivityTypes[]} />
      </div>
    </div>
  );
};

export default page;
