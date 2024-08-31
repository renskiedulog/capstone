import { checkSession } from "@/components/utils/Authenticator";
import { getTellerInfo } from "@/lib/api/tellerActions";
import { redirect } from "next/navigation";
import Profile from "./Profile";

type ProfileParams = {
  params: {
    username: string;
  };
};

const userDetails = {
  id: "32165465465",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  username: "johndoe123",
  password: "password123",
  isAdmin: false,
  address: "123 Main St, Anytown, USA",
  contact: "+1234567890",
  birthdate: "1990-01-01", // Updated format
  status: "active",
  createdAt: "2024-08-01T12:34:56Z",
  updatedAt: "2024-08-01T12:34:56Z",
  image:
    "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
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
    <section>
      <Profile data={accountInfo} isAdmin={session?.user?.isAdmin} />
    </section>
  );
};

export default page;
