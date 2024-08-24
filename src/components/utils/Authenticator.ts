import {
  CustomSessionType,
  options,
} from "@/app/(NextAuth)/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const checkSession = async () => {
  let session: CustomSessionType | null =
    (await getServerSession(options)) || null;
  return session;
};
