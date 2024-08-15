"use client";
import React from "react";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminLinks, navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Avatar from "./Avatar";
import { NavLinkProps } from "@/lib/types";
import Alert from "./Alert";

const NavigationBar = () => {
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  const links = React.useMemo(() => {
    return session?.data?.user?.isAdmin ? adminLinks : navLinks;
  }, [session?.data?.user?.isAdmin]);

  const pathname = usePathname();

  return React.useMemo(
    () =>
      session?.status === "authenticated" && (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-full sm:w-14 flex-col border-r bg-background py-2 sm:py-0 h-max sm:h-full border-b">
          <nav className="flex flex-row sm:flex-col items-center gap-4 px-2 sm:py-4 h-max sm:h-full w-full">
            <Link
              href={`/profile/${username}`}
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground hover:scale-105 md:h-10 md:w-10 md:text-base"
            >
              <Avatar name={username as string} className="text-primary" />
            </Link>
            <div className="flex flex-row sm:flex-col gap-3 items-center w-full">
              {links?.map((link, idx) => (
                <NavLink
                  key={idx}
                  link={link?.link}
                  icon={link?.icon}
                  name={link?.name}
                  active={pathname === link?.link}
                />
              ))}
            </div>
            <div className="ml-auto sm:ml-0 sm:mt-auto justify-self-end flex flex-col items-center gap-4 px-2 sm:pt-4 w-max">
              <Tooltip>
                <Alert
                  title="Are you sure you want to logout?"
                  description="Logging out will end your current session and any unsaved changes will be lost. Do you wish to proceed?"
                  onConfirm={() => signOut()}
                  primaryBtn="Logout"
                >
                  <TooltipTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10">
                      <LogOutIcon />
                      <span className="sr-only">Logout</span>
                    </button>
                  </TooltipTrigger>
                </Alert>
                <TooltipContent side="right" className="left-10">
                  Logout
                </TooltipContent>
              </Tooltip>
            </div>
          </nav>
        </aside>
      ),
    [session?.status, username, links, pathname]
  );
};

const NavLink = ({ link, icon, name, active }: NavLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={link}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10 ${
            active && "bg-accent"
          }`}
        >
          {icon}
          <span className="sr-only">{name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{name}</TooltipContent>
    </Tooltip>
  );
};

export default React.memo(NavigationBar);
