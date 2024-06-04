"use server";
import {
  CustomSessionType,
  options,
} from "@/app/(NextAuth)/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const checkSession = async () => {
  let session: CustomSessionType | null =
    (await getServerSession(options)) || null;
  return session;
};

export const redirectToAdmin = (isAdmin: boolean) => {
  if (isAdmin) redirect("/admin");
};

export const redirectToTeller = (isAdmin: boolean) => {
  if (!isAdmin) redirect("/dashboard");
};
