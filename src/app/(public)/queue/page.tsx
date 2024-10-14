import Queue from "./Queue";
import { Queue as QueueType } from "@/lib/types";
import { fetchQueue } from "@/lib/api/queue";
import Boarding from "./Boarding";
import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";
import Sailing from "./Sailing";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  const queue = await fetchQueue();

  return (
    <div className="w-full text-black flex lg:flex-row flex-col gap-5">
      <Queue initialItems={queue as QueueType[]} />
      <div className="flex gap-5 sm:flex-wrap lg:flex-row flex-col w-full">
        <Boarding />
        <Sailing />
      </div>
    </div>
  );
};

export default page;
