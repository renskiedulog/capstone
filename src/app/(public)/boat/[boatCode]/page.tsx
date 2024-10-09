import NotFound from "@/app/not-found";
import { fetchBoatDetails } from "@/lib/api/boatActions";
import React from "react";
import BoatDetails from "./BoatDetails";
import { redirect } from "next/navigation";
import { checkSession } from "@/components/utils/Authenticator";
import { Boat } from "@/lib/types";

export async function generateMetadata() {
  return {
    title: "Boat Info",
  };
}

interface BoatProfileParams {
  params: {
    boatCode: string;
  };
}

const page = async ({ params }: BoatProfileParams) => {
  const session = await checkSession();
  if (!session) return redirect("/login");

  const boatDetails = (await fetchBoatDetails(params?.boatCode)) ?? null;

  if (!boatDetails) {
    return <NotFound />;
  }
  return <BoatDetails boatDetails={boatDetails as Boat} />;
};

export default page;
