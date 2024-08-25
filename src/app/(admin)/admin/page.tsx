import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import HorizontalCardChart from "./HorizontalCardChart";
import CircularChartCard from "./CircularChartCard";
import WaveChartCard from "./WaveChartCard";
import LineChartCard from "./LineChartCard";
import StatCards from "@/app/(teller)/dashboard/StatCards";
import { DollarSign } from "lucide-react";
import RecentTellers from "./RecentTellers";

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

export const metadata = {
  title: "Admin Dashboard",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  return (
    <div>
      <StatCards data={cards} />
      <HorizontalCardChart />
      <CircularChartCard />
      <WaveChartCard />
      <LineChartCard />
      <RecentTellers />
    </div>
  );
};

export default page;
