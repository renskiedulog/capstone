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
            await connectMongoDB(); // Ensure MongoDB connection is made

            const checkUser = await User.findOne({ username });

            if (!checkUser) {
              console.log("User not found");
              return null; // No Username Found
            }

            if (checkUser.isDeleted) {
              console.log("User is deleted");
              return null; // If user is deleted
            }

            const isPasswordMatch = await bcrypt.compare(
              password,
              checkUser.password
            );

            if (!isPasswordMatch) {
              console.log("Password mismatch");
              return null; // Incorrect password
            }

            // Update user status to 'active'
            checkUser.status = "active";
            await checkUser.save();

            // Optionally revalidate the path (depends on your requirements)
            revalidatePath("/admin/tellers");

            // Return user info
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
          return null; // Credentials are undefined
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
      try {
        if (session && token?.name) {
          await connectMongoDB(); // Ensure MongoDB connection is made

          // Find the user and exclude password & _id fields
          const userDocument: any = await User.findOne({ username: token.name })
            .select("-password -_id")
            .lean();

          if (userDocument) {
            session.user = userDocument;
          }

          return session;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
};
