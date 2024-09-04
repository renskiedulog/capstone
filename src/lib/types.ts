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
  birthdate: Date;
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
  image: any;
}

export interface Boat {
  _id: string;
  registrationNumber: string;
  mainImage?: string;
  ownerName: string;
  capacity: number;
  status: "queueing" | "boarding" | "standby";
  registrationStatus: "registered" | "pending" | "unregistered";
  boatDetails: string;
  images: String[];
  additionalInfo?: string;
  boatCode?: string;
  contactNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}
