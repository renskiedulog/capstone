import { connectMongoDB, disconnectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    await connectMongoDB();
    const req = await User.find({ isAdmin: false });
    const tellers = req.map((teller) => ({
      _id: teller._id.toString(),
      firstName: teller.firstName,
      image: teller.image,
      lastName: teller.lastName,
      fullName: teller.fullName,
      username: teller.username,
      password: teller.password,
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
