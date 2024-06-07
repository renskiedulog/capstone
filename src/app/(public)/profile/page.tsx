import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await checkSession();
  if (!session) return redirect("/login");
  redirect(`/profile/${session?.user?.username}`);
};

export default page;
