import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/components/utils/NavigationBar";
import TopNav from "@/components/utils/TopNav";
import SessionProvider from "@/components/utils/SessionProvider";
import { options } from "./(NextAuth)/api/auth/[...nextauth]/options";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: `${
      process.env.APP_NAME ? `${process.env.APP_NAME} | QueueMS` : "QueueMS"
    }`,
    template: `%s | ${process.env.APP_NAME || "QueueMS"}`,
  },
  description: "Making Things Flow As Gentle As The Waves.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session: any;
  try {
    session = await getServerSession(options);
  } catch (error) {
    console.log(error);
  }

  return (
    <html lang="en">
      <body className={`${inter.className} max-w-[2000px]`}>
        <SessionProvider session={session}>
          <TooltipProvider>
            <NavigationBar />
            <div className="p-2 sm:p-8 sm:pl-20 sm:pt-0 pt-16">
              <TopNav />
              {children}
              <Toaster />
            </div>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
