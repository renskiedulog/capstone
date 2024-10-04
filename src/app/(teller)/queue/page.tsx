import { checkSession } from "@/components/utils/Authenticator";

import { redirect } from "next/navigation";
import Queue from "./Queue";
import { Queue as QueueType } from "@/lib/types";
import { fetchQueue } from "@/lib/api/queue";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (session?.user?.isAdmin as boolean) redirect("/admin"); //! 3. Avoid Admin From Accessing Teller Page

  const queue = await fetchQueue();

  return (
    session && (
      <div className="w-full text-black grid grid-cols-1 md:grid-cols-[450px,auto]">
        <Queue initialItems={queue as QueueType[]} />
      </div>
    )
  );
};

export default page;
