import Queue from "./Queue";
import { Queue as QueueType } from "@/lib/types";
import { fetchBoarding, fetchQueue, fetchSailing } from "@/lib/api/queue";
import Boarding from "./Boarding";
import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import Sailing from "./Sailing";


export const metadata = {
  title: "Queue",
};

export const revalidate = 5;

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access

  const [queue, boarding, sailing] = await Promise.all([
    fetchQueue(),
    fetchBoarding(),
    fetchSailing(),
  ]);

  return (
    <div className="w-full text-black flex lg:flex-row flex-col gap-5">
      <Queue initialItems={queue as QueueType[]} />
      <div className="flex gap-5 sm:flex-wrap lg:flex-row flex-col w-full h-max">
        <Boarding initData={boarding as QueueType[]} />
        <Sailing initData={sailing} />
      </div>
    </div>
  );
};

export default page;
