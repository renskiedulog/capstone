import { DashboardIcon } from "@radix-ui/react-icons";
import {
  CalendarIcon,
  LineChart,
  PlusIcon,
  SailboatIcon,
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
    icon: <Ship />,
  },
];

export const hideTopNav = ["/login", "/"];

export const hideNav = ["/login"];

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
