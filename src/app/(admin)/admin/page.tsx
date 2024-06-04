import {
  checkSession,
  redirectToTeller,
} from "@/components/utils/Authenticator";

const page = async () => {
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToTeller(session?.user?.isAdmin as boolean);

  return <div></div>;
};

export default page;
