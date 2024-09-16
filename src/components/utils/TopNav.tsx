"use client";
import React from "react";
import Breadcrumb from "./BreadCrumb";
import { useSession } from "next-auth/react";
import Command from "./Command";
import { hideNav } from "@/lib/constants";
import { usePathname } from "next/navigation";

const TopNav = () => {
  const session = useSession() || null;
  const pathname = usePathname();

  if (session?.status !== "authenticated" || hideNav?.includes(pathname))
    return;
  return (
    <div className="hidden w-full items-center justify-between p-5 pl-0 sm:flex">
      <Breadcrumb />
      <Command />
    </div>
  );
};

export default TopNav;
