import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

export const metadata = {
  title: "Statistics",
};

const page = async () => {
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return <div>page</div>;
};

export default page;
