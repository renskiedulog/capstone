import {
  checkSession,
  redirectToAdmin,
} from "@/components/utils/Authenticator";

import Board from "./Board";

export const metadata = {
  title: "Queue",
};

const page = async () => {
  let session;
  try {
    session = await checkSession();
  } catch (e) {
    console.log(e);
  }
  redirectToAdmin(session?.user?.isAdmin as boolean);

  return (
    <div className="h-screen w-full text-black">
      <Board />
    </div>
  );
};

export default page;
