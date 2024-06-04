import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

export const metadata = {
  title: "Dashboard",
};

const page = async () => {
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToAdmin(session?.user?.isAdmin as boolean);

  if (!session) return null;
  return <div>page</div>;
};

export default page;
