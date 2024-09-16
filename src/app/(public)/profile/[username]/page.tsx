import { checkSession } from "@/components/utils/Authenticator";
import { getTellerInfo } from "@/lib/api/tellerActions";
import { redirect } from "next/navigation";
import Profile from "./Profile";

type ProfileParams = {
  params: {
    username: string;
  };
};

//! Generate Page Title Based On Profile Username
export async function generateMetadata({ params }: ProfileParams) {
  return {
    title: params?.username,
  };
}

const page = async ({ params }: ProfileParams) => {
  const session = await checkSession();
  if (!session) return redirect("/login");

  const accountInfo = await getTellerInfo(params.username);

  return (
    <Profile
      data={accountInfo}
      isAdmin={session?.user?.isAdmin as boolean}
      user={session.user?.username as string}
    />
  );
};

export default page;
