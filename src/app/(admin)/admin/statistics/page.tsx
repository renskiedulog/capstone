import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import Statistics from "./Statistics";
import {
  getAverageQueueTimeByRange,
  getPassengerCountWithPercentage,
  getSailsCountWithPercentage,
  getTotalFareEarnedByRange,
} from "@/lib/api/statistics";

export const metadata = {
  title: "Statistics",
};

export const revalidate = 60;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  const [sails, passengers, fare, queue] = await Promise.all([
    getSailsCountWithPercentage("today"),
    getPassengerCountWithPercentage("today"),
    getTotalFareEarnedByRange("today"),
    getAverageQueueTimeByRange("today"),
  ]);

  const initStatistics = { sails, passengers, fare, queue };

  return session && <Statistics initData={initStatistics} />;
};

export default page;
