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
  birthdate: Date | string;
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
  mainImage?: string;
  ownerName?: string;
  capacity: number;
  status?: "queueing" | "boarding" | "standby";
  checkingStatus?:
    | "not-checked"
    | "checked"
    | "under-inspection"
    | "requires-repair"
    | "not-sailable"
    | string;
  boatFeatures?: string;
  images?: String[];
  additionalInfo?: string;
  boatCode?: string;
  ownerContactNumber?: string;
  driverContactNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  driverName?: string;
  boatName?: string;
  lastCheck?: Date | string | null;
  checkingDetails?: string;
}

export interface ActivityTypes {
  _id: string;
  title: string;
  subtitle: string;
  details: string;
  link: string;
  type: "teller" | "boat" | "passenger" | "queue";
  createdAt: string;
}

export interface Queue {
  _id: string;
  id: string;
  boatName: string;
  boatCode?: string;
  position?: number;
  status: "in-queue" | "boarding" | "sailing";
  passengerCount?: number;
  passengerIds?: string[];
  queuedAt?: Date;
  estimatedDepartureTime?: Date;
  createdBy?: string;
  destination?: string;
  departureTime?: Date;
  createdAt?: String | Date;
  driverName?: String;
  capacity?: number;
  mainImage?: string;
}
