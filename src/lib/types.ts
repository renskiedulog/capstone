import { DefaultSession } from "next-auth";

export type NavLinkProps = {
  link: string;
  icon: React.ReactNode;
  name: string;
  active: boolean;
};
