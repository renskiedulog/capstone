"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";

const NotFound = () => {
  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isAuthenticated ? "h-[80vh]" : "absolute left-0 top-0 h-full"
      } w-full`}
    >
      <Image
        alt="not-found-image"
        src="/images/not-found.png"
        width={300}
        height={200}
      />
      <h1 className="text-3xl font-bold tracking-wide text-primary/70">
        Page Not Found.
      </h1>
      <p className="w-7/12 py-2 text-center text-sm md:text-base">
        Ahoy there! It seems we've drifted into uncharted waters. The page
        you're seeking may have set sail without us. Let's navigate back to
        familiar shores together!
      </p>
      <a href="/">
        <Button className="my-2">GO TO HOMEPAGE</Button>
      </a>
    </div>
  );
};

export default NotFound;
