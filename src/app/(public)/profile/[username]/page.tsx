import { checkSession } from "@/components/utils/Authenticator";
import { redirect } from "next/navigation";

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
  return <div>{params?.username}</div>;
};

export default page;
