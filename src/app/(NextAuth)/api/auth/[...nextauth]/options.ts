import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { RequestInternal, User as UserTypes } from "next-auth";
import { JWT } from "next-auth/jwt";
import { connectMongoDB } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CustomUser extends UserTypes {
  isAdmin?: boolean;
}

export interface CustomSessionType {
  user?: {
    username?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isAdmin?: boolean;
  };
}

export const options: any = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(
        credentials: Record<string, string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<CustomUser | null> {
        if (credentials) {
          const { username, password } = credentials;
          try {
            if (
              username === process.env.ADMIN_ACC?.split(":")[0] &&
              password === process.env.ADMIN_ACC?.split(":")[1]
            ) {
              return {
                name: "admin",
                isAdmin: true,
                id: "admin",
              };
            }

            await connectMongoDB();
            const checkUser = (await User?.findOne({ username })) || null;

            if (!checkUser) {
              return null; // No Username Found
            }

            if (checkUser.isDeleted) {
              return null; // If user is deleted
            }

            const isPasswordMatch = await bcrypt.compare(
              password,
              checkUser.password
            );

            if (!isPasswordMatch) {
              return null; // wrong password
            }

            checkUser.status = "active";
            await checkUser.save();

            revalidatePath("/admin/tellers", "page");

            return {
              name: checkUser.username,
              isAdmin: checkUser.isAdmin,
              id: checkUser.id,
            };
          } catch (error) {
            console.log(error);
            return null;
          }
        } else {
          return null; // Credentials object is undefined
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: CustomSessionType;
      token: JWT;
    }) {
      if (session) {
        if (session?.user?.name === "admin") {
          session.user.isAdmin = true;
          return session;
        }
        const userDocument: any = await User.findOne({
          username: token?.name,
        }).select("-password -_id");
        session.user = userDocument?.toObject();
        return session;
      } else return session;
    },
  },
};
