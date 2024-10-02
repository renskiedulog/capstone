import {
  CustomSessionType,
  options,
} from "@/app/(NextAuth)/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const checkSession = async () => {
  let session: CustomSessionType;
  try {
    session = (await getServerSession(options)) ?? {};
    if (!session) return false;
    return true;
  } catch (error) {}
};

export const refreshPage = async (page: string) => {
  try {
    revalidatePath(page);
    return true;
  } catch (error) {
    return false;
  }
};
