"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const loading = () => {
  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isAuthenticated ? "h-[80vh]" : "absolute left-0 top-0 h-full"
      } w-full`}
    >
      <Image
        src="/images/loader.gif"
        className="size-60"
        priority
        width={300}
        height={300}
        alt="loader-image"
      />
      <p className="-translate-y-[80px] pl-2 text-center text-lg text-black/80">
        Loading...
      </p>
    </div>
  );
};

export default loading;
