import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/components/utils/NavigationBar";
import TopNav from "@/components/utils/TopNav";
import SessionProvider from "@/components/utils/SessionProvider";
import { options } from "./(NextAuth)/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

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
    //! If Anything goes wrong, go back to login - hasSession ? fetch Session redir to dashboard : Login Page;
    console.log(error);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TooltipProvider>
            <NavigationBar />
            <div className="px-2 sm:px-8 sm:pl-20">
              <TopNav />
              {children}
            </div>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
