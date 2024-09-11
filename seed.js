import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { models, Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    email: String,
    address: String,
    image: String,
    contact: String,
    birthdate: Date,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function disconnectDB() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

async function seedAdmin() {
  try {
    await connectMongoDB();

    const adminUsername = "admin";
    const adminPassword = "admin";

    const existingAdmin = await User.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log("Admin account already exists.");
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
        image: "",
        isAdmin: true,
      });

      console.log("Admin account created successfully.");
    }

    await disconnectDB();
  } catch (error) {
    console.error("Error seeding admin account:", error);
    await disconnectDB();
  }
}

seedAdmin();
