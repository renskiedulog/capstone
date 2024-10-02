import * as React from "react";
import { useMotionValue, Reorder } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import { Edit, Ellipsis, Ship, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface Props {
  item: string;
  setDropped: (e: boolean) => boolean;
}

export const Item = ({ item, setDropped }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <div className="relative">
      <Reorder.Item
        value={item}
        id={item}
        layout
        style={{ boxShadow, y }}
        onMouseDown={(e: any) => e.target.classList.add("cursor-grabbing")}
        onDragEnd={(e: any) => {
          e.target.classList.remove("cursor-grabbing");
          setDropped(true);
        }}
        className="border p-2 rounded mb-1 cursor-grab bg-secondary flex items-center justify-between"
      >
        {item}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              // href={`/boat/${row.original.boatCode}`}
              href={"#"}
              className="text-black/80 group-hover:text-black"
            >
              <DropdownMenuItem className="cursor-pointer gap-1.5 font-medium">
                <Ship size={18} />
                <span>Details</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              // onClick={() => {
              //   setIsDeleteAlertOpen(true);
              //   setDeleteBoat(row?.original?._id);
              // }}
              className="cursor-pointer text-red-500 hover:!text-red-500 gap-1.5"
            >
              <Trash size={18} />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Reorder.Item>
    </div>
  );
};
