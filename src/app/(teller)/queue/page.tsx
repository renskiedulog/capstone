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
    <div className="w-full text-black grid grid-cols-1 md:grid-cols-[450px,auto,350px] gap-x-5">
      <Queue initialItems={queue as QueueType[]} />
      <Boarding />
      <Sailing />
    </div>
  );
};

export default page;
