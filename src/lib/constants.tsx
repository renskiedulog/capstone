import { DashboardIcon } from "@radix-ui/react-icons";
import {
  CalendarIcon,
  History,
  LineChart,
  PlusIcon,
  SailboatIcon,
  SaveAll,
  Ship,
  Table,
  User2Icon,
} from "lucide-react";

export const navLinks = [
  {
    link: "/dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    link: "/queue",
    name: "Boat Queue",
    icon: <Ship />,
  },
  {
    link: "/boats",
    name: "Boat List",
    icon: <Table />,
  },
  {
    link: "/statistics",
    name: "Statistics",
    icon: <LineChart />,
  },
  {
    link: "/activity",
    name: "Activity",
    icon: <SaveAll />,
  },
  {
    link: "/queue-history",
    name: "Queue History",
    icon: <History />,
  },
];

export const adminLinks = [
  {
    link: "/admin",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    link: "/admin/tellers",
    name: "Tellers",
    icon: <User2Icon />,
  },
  {
    link: "/admin/boats",
    name: "Boats",
    icon: <Table />,
  },
  {
    link: "/queue",
    name: "Queue",
    icon: <Ship />,
  },
  {
    link: "/activity",
    name: "Activity",
    icon: <SaveAll />,
  },
  {
    link: "/queue-history",
    name: "Queue History",
    icon: <History />,
  },
];

export const hideNav = ["/departing", "boat-queue"];

export const commandLinks = [
  {
    heading: "Common Links",
    links: [
      {
        icon: <DashboardIcon className="mr-2 h-4 w-4" />,
        title: "Dashboard Page",
        link: "/dashboard",
      },
      {
        icon: <SailboatIcon className="mr-2 h-4 w-4" />,
        title: "Boats Page",
        link: "/boats",
      },
    ],
  },
  {
    heading: "Boat Actions",
    links: [
      {
        icon: <PlusIcon className="mr-2 h-4 w-4" />,
        title: "Add Boat",
        link: "/boats/add",
      },
    ],
  },
];

export const capacityCategory = {
  small: 15,
  medium: 30,
  large: 50,
};

export function checkBoatCapacity(capacity: number) {
  if (capacity <= capacityCategory.small) {
    return "small";
  } else if (capacity <= capacityCategory.medium) {
    return "medium";
  } else if (capacity <= capacityCategory.large) {
    return "large";
  } else {
    return "extra";
  }
}
