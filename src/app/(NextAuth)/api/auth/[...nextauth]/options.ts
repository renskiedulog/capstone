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
            await connectMongoDB();

            const checkUser = await User.findOne({ username });

            if (!checkUser) {
              console.log("User not found");
              return null;
            }

            if (checkUser.isDeleted) {
              console.log("User is deleted");
              return null;
            }

            const isPasswordMatch = await bcrypt.compare(
              password,
              checkUser.password
            );

            if (!isPasswordMatch) {
              console.log("Password mismatch");
              return null;
            }

            checkUser.status = "active";
            await checkUser.save();

            revalidatePath("/admin/tellers");

            return {
              name: checkUser.username,
              isAdmin: checkUser.isAdmin,
              id: checkUser.id,
            };
          } catch (error) {
            console.error("Authorization error:", error);
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Check if the username has been changed (e.g., when updating the profile)
      if (user) {
        token.name = user.username || token.name; // Update token's name with the new username
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSessionType;
      token: JWT;
    }) {
      try {
        if (session && token?.name) {
          await connectMongoDB();

          const userDocument: any = await User?.findOne({
            username: token.name,
          })
            .select("-password -_id")
            .lean();

          if (userDocument) {
            session.user = userDocument;
          }

          return session;
        }
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
};
