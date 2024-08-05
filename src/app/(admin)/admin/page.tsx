import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import HorizontalCardChart from "./HorizontalCardChart";
import CircularChartCard from "./CircularChartCard";
import WaveChartCard from "./WaveChartCard";
import LineChartCard from "./LineChartCard";

export const metadata = {
  title: "Admin Dashboard"
}

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  return <div>
    <HorizontalCardChart />
    <CircularChartCard />
    <WaveChartCard />
    <LineChartCard />
  </div>;
};

export default page;
