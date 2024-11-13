import { Option } from "@/components/ui/multiple-selector";
import {
  CounterClockwiseClockIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";
import {
  Archive,
  History,
  LineChart,
  ListOrdered,
  ListRestart,
  Plus,
  SailboatIcon,
  SaveAll,
  Ship,
  Table,
  User,
  User2Icon,
  Users2,
} from "lucide-react";

export const navLinks = [
  {
    link: "/dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    link: "/boats",
    name: "Boat List",
    icon: <Ship />,
  },
  {
    link: "/queue",
    name: "Boat Queue",
    icon: <ListOrdered />,
  },
  {
    link: "/sail-history",
    name: "Sail History",
    icon: <ListRestart />,
  },
  {
    link: "/activity",
    name: "Activity",
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
    icon: <Ship />,
  },
  {
    link: "/queue",
    name: "Queue",
    icon: <ListOrdered />,
  },
  {
    link: "/sail-history",
    name: "Sail History",
    icon: <ListRestart />,
  },
  {
    link: "/activity",
    name: "Activity",
    icon: <History />,
  },
  {
    link: "/admin/passengers",
    name: "Passenger History",
    icon: <Users2 />,
  },
  {
    link: "/admin/statistics",
    name: "Statistics",
    icon: <LineChart />,
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
      {
        icon: <Ship className="mr-2 h-4 w-4" />,
        title: "Queue Page",
        link: "/queue",
      },
      {
        icon: <Archive className="mr-2 h-4 w-4" />,
        title: "Activity Page",
        link: "/activity",
      },
      {
        icon: <CounterClockwiseClockIcon className="mr-2 h-4 w-4" />,
        title: "Sail History Page",
        link: "/sail-history",
      },
      {
        icon: <User className="mr-2 h-4 w-4" />,
        title: "Profile Page",
        link: "/profile",
      },
    ],
  },
  {
    heading: "Actions",
    links: [
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        title: "Add Boat",
        link: "/boats",
      },
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        title: "Add Queue",
        link: "/queue",
      },
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        title: "Add Boarding",
        link: "/queue",
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

export const DestinationOptions: Option[] = [
  { label: "Mactan Island", value: "mactan-island" },
  { label: "Gilutongan Island", value: "gilutungan-island" },
  { label: "Pandanon Island", value: "pandanon-island" },
  { label: "Caubian Island", value: "caubian-island" },
  { label: "Caohagan Island", value: "cauhagan-island" },
  { label: "Nalusuan Island", value: "nalusuan-island" },
  { label: "Mundo Island", value: "mundo-island" },
  { label: "Crab", value: "crab" },
  { label: "Sulpa Islet", value: "sulpa-islet" },
  { label: "Camungi", value: "camungi" },
  { label: "Alegrado", value: "alegrado" },
  { label: "Paradise Island", value: "paradise-island" },
  { label: "Angasil Port", value: "angasil-port" },
  { label: "Mactan New Port", value: "mactan-new-port" },
  { label: "Kasamahan Port", value: "kasamahan-port" },
  { label: "Marigondon Port", value: "marigondon-port" },
  { label: "Hilton Port", value: "hilton-port" },
  { label: "Santa Rosa Port", value: "santa-rosa-port" },
];
