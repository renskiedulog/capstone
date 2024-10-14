"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Queue } from "@/lib/types";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Clock,
  Info,
  Ship,
  ShipWheel,
  Trash,
  User,
  UsersRound,
} from "lucide-react";

import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Boarding = ({ initData }: { initData: Queue[] }) => {
  const [showInfo, setShowInfo] = useState("");

  console.log(initData);
  return (
    <Card className="flex-none sm:flex-1 lg:min-w-[500px] pb-2 h-max">
      <CardHeader className="pb-2">
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        {initData?.length > 0 ? (
          initData?.map((boat, idx) => (
            <BoardingBoat
              key={idx}
              boat={boat}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
            />
          ))
        ) : (
          <div className="text-center p-5">
            There are no boats currently on boarding.
          </div>
        )}
      </div>
    </Card>
  );
};

export default Boarding;

const BoardingBoat = ({
  boat,
  showInfo,
  setShowInfo,
}: {
  boat: Queue;
  showInfo: string;
  setShowInfo: (e: string) => void;
}) => {
  return (
    <>
      <div className="bg-secondary mt-1.5 p-2 rounded-md border flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Image
            src={boat.mainImage || "/images/default-image.jpg"}
            width={30}
            height={30}
            alt={boat?.boatName}
            className="aspect-square object-cover rounded"
          />
          <div className="px-2">
            <h1 className="">{boat?.boatName}</h1>
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem
                className="cursor-pointer gap-1.5 font-medium"
                onClick={handleChangeToBoarding}
              >
                <ArrowRightSquare size={18} />
                <span>Board</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="cursor-pointer gap-1.5 font-medium"
                onClick={() =>
                  setShowInfo(boat?._id === showInfo ? "" : boat?._id)
                }
              >
                <Info size={18} />
                <span>Details</span>
              </DropdownMenuItem>
              <Link
                href={`/boat/${boat?.boatCode}`}
                className="text-black/80 group-hover:text-black"
              >
                <DropdownMenuItem className="cursor-pointer gap-1.5 font-medium">
                  <Ship size={18} />
                  <span>Boat</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 hover:!text-red-500 gap-1.5"
                // onClick={() => handleDeleteQueue(item?.id)}
              >
                <Trash size={18} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <AnimatePresence>
        {showInfo === boat?._id && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-2 bg-secondary mb-1 border rounded"
          >
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Ship size={18} />
                <span>
                  <strong>Boat Code:</strong> {boat?.boatCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>
                  <strong>Created By:</strong> {boat?.createdBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  <strong>Queued At:</strong> <br />{" "}
                  {formatDateTime(boat?.createdAt as string)}
                </span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  <strong>Time Elapsed:</strong> <br /> {elapsedTime}
                </span>
              </div> */}
              <div className="flex items-center gap-2">
                <ShipWheel size={18} />
                <span>
                  <strong>Ship Captain:</strong> <br /> {boat?.driverName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UsersRound size={18} />
                <span>
                  <strong>Capacity:</strong> <br /> {boat?.capacity}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
