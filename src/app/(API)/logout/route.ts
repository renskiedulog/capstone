import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  CustomSessionType,
  options,
} from "../../(NextAuth)/api/auth/[...nextauth]/options";
import { connectMongoDB } from "@/lib/db";
import User from "@/models/User";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const session: CustomSessionType | null = await getServerSession(options);

  if (!session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const username = session?.user?.username;

  if (!username) {
    return NextResponse.json({ error: "Username not found" }, { status: 404 });
  }

  connectMongoDB();

  try {
    await User.updateOne(
      { username: username },
      { $set: { status: "inactive" } }
    );

    return NextResponse.json({ data: username, status: "inactive" });
  } catch (error) {
    console.error("Failed to update user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
};
