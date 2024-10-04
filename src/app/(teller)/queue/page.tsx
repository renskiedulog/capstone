import Queue from "./Queue";
import { Queue as QueueType } from "@/lib/types";
import { fetchQueue } from "@/lib/api/queue";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  const queue = await fetchQueue();

  return (
    <div className="w-full text-black grid grid-cols-1 md:grid-cols-[450px,auto]">
      <Queue initialItems={queue as QueueType[]} />
    </div>
  );
};

export default page;
