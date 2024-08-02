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

export interface UserTypes {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  address?: string;
  image?: string;
  contact?: string;
  birthdate?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}
