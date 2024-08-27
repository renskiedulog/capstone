import NextAuth from "next-auth";
import { options } from "./options";

export const GET = NextAuth(options);
export const POST = NextAuth(options);
