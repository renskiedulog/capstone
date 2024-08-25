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
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  email: string;
  address?: string;
  image?: string;
  contact: string;
  birthdate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface AccountDetailsTypes extends UserTypes {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  address: string;
  contact: string;
  birthdate: string;
  image: any;
}
