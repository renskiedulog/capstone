"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const GlobalError = () => {
  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";

  return (
    <html>
      <body className={inter.className}>
        <div
          className={`flex flex-col items-center justify-center ${
            isAuthenticated ? "h-[80vh]" : "absolute left-0 top-0 h-full"
          } w-full`}
        >
          <Image
            alt="not-found-image"
            src="/images/not-found.png"
            width={300}
            height={300}
          />
          <h1 className="text-3xl font-bold tracking-wide text-primary/70">
            Something Went Wrong.
          </h1>
          <p className="w-7/12 py-2 text-center text-sm md:text-base">
            Whoopsie-daisy! Seems like we've run into a little hiccup. The thing
            you're looking for might have taken a detour. But no sweat! Let's
            steer our way back to where things make sense, shall we?
          </p>
          <a href="/">
            <Button className="my-2">GO TO HOMEPAGE</Button>
          </a>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
