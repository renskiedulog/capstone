import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

export const metadata = {
  title: "Statistics",
};

const page = async () => {
  const session = await checkSession();
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return <div>page</div>;
};

export default page;
