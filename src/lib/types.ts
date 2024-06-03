import { Session } from "next-auth";

export type NavLinkProps = {
  link: string;
  icon: React.ReactNode;
  name: string;
  active: boolean;
};

export interface CustomUserData {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  username: string;
}
