import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
      name: process.env.APP_NAME! as string,
      options: { timeout: 10000 },
    }),
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
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectMongoDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.name = user.username || token.name;
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
        await connectMongoDB();

        let userDocument: any | null = null;

        if (token?.email) {
          userDocument = await User.findOneAndUpdate(
            { email: token.email },
            { status: "active" },
            { new: true }
          )
            .select("-password -_id")
            .lean();

          if (!userDocument) {
            console.warn(`User with email ${token.email} not found.`);
          }
        } else if (token?.name) {
          userDocument = await User.findOneAndUpdate(
            { username: token.name },
            { status: "active" },
            { new: true }
          )
            .select("-password -_id")
            .lean();

          if (!userDocument) {
            console.warn(`User with username ${token.name} not found.`);
          }
        }

        if (userDocument) {
          session.user = userDocument;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }

      return session;
    },
  },
};
