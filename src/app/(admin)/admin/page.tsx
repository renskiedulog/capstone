import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import HorizontalCardChart from "./HorizontalCardChart";
import CircularChartCard from "./CircularChartCard";
import WaveChartCard from "./WaveChartCard";
import LineChartCard from "./LineChartCard";
import StatCards from "@/app/(teller)/dashboard/StatCards";
import { DollarSign, UserIcon } from "lucide-react";
import RecentTellers from "./RecentTellers";
import { getTellerCount } from "@/lib/api/common";

export const metadata = {
  title: "Admin Dashboard",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const tellerCount = await getTellerCount();

  const cards = [
    {
      cardTitle: "Total Teller Accounts",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      stats: tellerCount?.totalTellersCount,
      info:
        tellerCount?.currentMonthTellersCount > 0
          ? `There are ${tellerCount?.currentMonthTellersCount} new tellers this month.`
          : "No new tellers this month.",
    },
    {
      cardTitle: "Total Teller Accounts",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      stats: tellerCount?.totalTellersCount,
      info:
        tellerCount?.currentMonthTellersCount > 0
          ? `There are ${tellerCount?.currentMonthTellersCount} new tellers this month.`
          : "No new tellers this month.",
    },
    {
      cardTitle: "Total Teller Accounts",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      stats: tellerCount?.totalTellersCount,
      info:
        tellerCount?.currentMonthTellersCount > 0
          ? `There are ${tellerCount?.currentMonthTellersCount} new tellers this month.`
          : "No new tellers this month.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] xl:grid-cols-[70%,30%] gap-2">
      <StatCards data={cards} />
      <RecentTellers />
    </div>
  );
};

export default page;
