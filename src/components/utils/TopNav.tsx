"use client";
import React from "react";
import Breadcrumb from "./BreadCrumb";
import { useSession } from "next-auth/react";
import Command from "./Command";

const TopNav = () => {
  const session = useSession() || null;

  if (session?.status !== "authenticated") return;
  return (
    <div className="hidden w-full items-center justify-between p-5 pl-0 sm:flex">
      <Breadcrumb />
      <Command />
    </div>
  );
};

export default TopNav;
