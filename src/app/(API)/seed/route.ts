import { connectMongoDB, disconnectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const adminUsername = "admin";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ username: adminUsername });

    if (existingAdmin) {
      await disconnectDB();
      return NextResponse.json(
        { message: "Admin account already exists." },
        { status: 200 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        username: adminUsername,
        password: hashedPassword,
        fullName: "Admin User",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        address: "ADMIN",
        contact: "ADMIN",
        birthdate: new Date("1970-01-01"),
        image: null,
        isAdmin: true,
      });

      await disconnectDB();
      return NextResponse.json(
        { message: "Admin account created successfully." },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error seeding admin account:", error);
    await disconnectDB();
    return NextResponse.json(
      { message: "Error seeding admin account." },
      { status: 500 }
    );
  }
}
