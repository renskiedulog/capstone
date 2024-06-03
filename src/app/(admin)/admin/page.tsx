import {
  checkSession,
  redirectToTeller,
} from "@/components/utils/Authenticator";

const page = async () => {
  const session = await checkSession();
  redirectToTeller(session?.role);

  return <div></div>;
};

export default page;
