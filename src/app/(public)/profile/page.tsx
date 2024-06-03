import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession();
  redirect(`/profile/${session?.user?.name}`);
};

export default page;
