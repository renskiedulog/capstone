import { options } from "@/app/(NextAuth)/api/auth/[...nextauth]/options";
import { connectMongoDB, disconnectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const GET = async () => {
  const session = await getServerSession(options);
  if (!session?.user || !session?.user?.isAdmin)
    return NextResponse.json({
      message: "Invalid credentials. Unable to access protected route.",
    });
  try {
    await connectMongoDB();
    const req = await User.find({ isAdmin: false }).select("-password");
    const tellers = req.map((teller) => ({
      _id: teller._id.toString(),
      firstName: teller.firstName,
      image: teller.image,
      lastName: teller.lastName,
      fullName: teller.fullName,
      username: teller.username,
      email: teller.email,
      address: teller.address,
      contact: teller.contact,
      birthdate: teller.birthdate,
      status: teller.status,
      createdAt: teller.createdAt.toISOString(),
      updatedAt: teller.updatedAt.toISOString(),
    }));
    await disconnectDB();
    return NextResponse.json({ data: tellers });
  } catch (error) {
    return NextResponse.error();
  }
};

export default GET;
