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
  actionBy: string;
}

export interface Queue {
  _id: string;
  id: string;
  boatName: string;
  boatCode?: string;
  position?: number;
  status: "in-queue" | "boarding" | "sailing";
  passengerIds?: string[];
  queuedAt?: Date;
  estimatedDepartureTime?: Date;
  createdBy?: string;
  destination?: string[];
  departureTime?: Date;
  createdAt?: String | Date;
  driverName?: String;
  capacity: number;
  mainImage?: string;
  boardingAt: Date | string;
  locationHistory?: {
    currentLocation?: string;
    timestamps?: [{ location: string; timestamp: string }];
  };
  sailedAt: Date | string;
  completedAt?: Date | string;
  totalAmountPaid?: number;
}

export interface Passenger {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  queueId: string;
  amountPaid: number;
  addedBy: string;
  createdAt?: Date | string;
}

export interface StatisticsType {
  sails: {
    currentCount: number;
    previousCount: number;
    percentageDifference: number;
  };
  passengers: {
    currentCount: number;
    previousCount: number;
    percentageDifference: number;
  };
  fare: {
    currentTotal: number;
    percentageDifference: number;
    previousTotal: number;
  };
  queue: {
    current: {
      hours: number;
      minutes: number;
    };
    percentageDifference: number;
  };
  sailsForPie: {
    boatId: string;
    boatName: string;
    sailCount: number;
  }[];
  passengerTrend: any;
  queueSummary: any;
}
