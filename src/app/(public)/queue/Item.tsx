"use client";
import * as React from "react";
import { useMotionValue, Reorder, AnimatePresence } from "framer-motion";
import {
  ArrowRightSquare,
  Clock,
  Info,
  Ship,
  ShipWheel,
  Trash,
  User,
  UsersRound,
  XIcon,
} from "lucide-react";
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
import { Queue } from "@/lib/types";
import { changeToBoarding, deleteQueueItem } from "@/lib/api/queue";
import socket from "@/socket";
import { motion } from "framer-motion";
import { formatDateTime, getTimeElapsed } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { checkBoatCapacity, DestinationOptions } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { addNewActivity } from "@/lib/api/activity";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

interface Props {
  item: Queue;
  setDropped: (e: boolean) => void;
  dragConstraints: React.RefObject<HTMLDivElement>;
  showInfo: string;
  setShowInfo: (e: string) => void;
  setGrabbedQueue: (e: string) => void;
  syncData: () => void;
  pos?: number;
}

export const Item = ({
  item,
  setDropped,
  dragConstraints,
  showInfo,
  setShowInfo,
  setGrabbedQueue,
  syncData,
  pos,
}: Props) => {
  const y = useMotionValue(0);
  const [elapsedTime, setElapsedTime] = React.useState("");
  const [toBoard, setToBoard] = React.useState(false);
  const [error, setError] = React.useState("");
  const [destination, setDestination] = React.useState<Option[]>([]);
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  const { toast } = useToast();

  const handleCloseModal = () => {
    // setDestination(item?.destination);
    setToBoard(false);
  };

  const handleDeleteQueue = async (id: string) => {
    try {
      await deleteQueueItem(id);
      await addDeleteBoardingActivity();
      socket.emit("queueRefresh");
      toast({
        title: "Queue Deleted Successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addDeleteBoardingActivity = async () => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "queue",
      title: "Deleted Queue",
      details: `The queue for the boat named '${item.boatName}' has been deleted.`,
      actionBy: username,
    });
    socket.emit("newActivity");
  };

  const handleChangeToBoarding = async () => {
    const destinationMap = destination?.map((v) => v.value);
    if (!destinationMap || destinationMap?.length === 0) return;
    setToBoard(false);
    await changeToBoarding(item.id as string, destinationMap);
    await addBoardingActivity();
    toast({
      title: "Boat Boarded.",
      description: "You can view the details on this boat on the Boarding Tab.",
    });
    syncData();
    setDestination([]);
    socket.emit("boardingRefresh");
  };

  const addBoardingActivity = async () => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "queue",
      title: "Boat Successfully Boarded.",
      details: `The boat named '${item.boatName}' is now boarding passengers.`,
      actionBy: username,
      link: `/queue`,
    });
    socket.emit("newActivity");
  };

  React.useEffect(() => {
    if (showInfo === item.id) {
      const intervalId = setInterval(() => {
        setElapsedTime(getTimeElapsed(item?.createdAt as string));
      }, 1000);

      setElapsedTime(getTimeElapsed(item?.createdAt as string));

      return () => clearInterval(intervalId);
    } else {
      setElapsedTime("");
    }
  }, [showInfo, item.id, item.createdAt]);

  return (
    <>
      {toBoard && (
        <div className="bg-black/50 w-full h-screen fixed top-0 left-0 z-[99] flex items-center justify-center">
          <Card
            className="border-none w-full max-w-lg mx-5 relative max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <XIcon
              className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
              onClick={handleCloseModal}
            />
            <CardHeader>
              <CardTitle>Set To Boat</CardTitle>
              <CardDescription>
                Provide the target destination for this boat.
              </CardDescription>
              {error !== "" && (
                <CardDescription className="text-red-500">
                  {error}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="mx-auto ">
              <div className="flex items-center space-x-2 flex-col md:flex-row gap-2">
                <div className="grid flex-1 gap-2 w-full">
                  <Label htmlFor="link" className="sr-only w-full">
                    Link
                  </Label>
                  {/* <Input
                    id="link"
                    placeholder="Provide a destination for the sail."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  /> */}
                  <MultipleSelector
                    defaultOptions={DestinationOptions}
                    placeholder={
                      DestinationOptions?.length === destination?.length
                        ? ""
                        : "Select the destinations..."
                    }
                    emptyIndicator={
                      <p className="text-center text-base leading-10 text-gray-600 dark:text-gray-400">
                        No Results Found.
                      </p>
                    }
                    value={destination}
                    onChange={setDestination}
                    className="w-full"
                  />
                </div>
                <Button
                  size="sm"
                  className="px-0 md:px-3 w-full md:w-max ml-0"
                  onClick={() => handleChangeToBoarding()}
                >
                  Board
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Reorder.Item
        value={item}
        id={item.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ y }}
        dragConstraints={dragConstraints}
        onMouseDown={(e: any) => {
          e.target.classList.add("cursor-grabbing", "shadow-md");
          setGrabbedQueue(item.boatName);
        }}
        onDragEnd={(e: any) => {
          e.target.classList.remove("cursor-grabbing", "shadow-md");
          setDropped(true);
        }}
        onMouseUp={(e: any) => {
          e.target.classList.remove("cursor-grabbing", "shadow-md");
        }}
        className="border p-2 rounded mb-1 cursor-grab bg-secondary flex items-center justify-between"
      >
        {item.boatName}
        <div className="flex gap-2 items-center">
          <Badge className="uppercase !text-[9px] tracking-wider font-bold py-0.5 px-2 min-w-[70px] items-center justify-center">
            {checkBoatCapacity(item?.capacity as number)}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(item?.position === 1 || pos === 0) && (
                <DropdownMenuItem
                  className="cursor-pointer gap-1.5 font-medium"
                  onClick={() => setToBoard(true)}
                >
                  <ArrowRightSquare size={18} />
                  <span>Board</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer gap-1.5 font-medium"
                onClick={() => setShowInfo(item?.id)}
              >
                <Info size={18} />
                <span>Details</span>
              </DropdownMenuItem>
              <Link
                href={`/boat/${item?.boatCode}`}
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
                onClick={() => handleDeleteQueue(item?.id)}
              >
                <Trash size={18} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Reorder.Item>
      <AnimatePresence>
        {showInfo === item.id && (
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
                  <strong>Boat Code:</strong> {item.boatCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>
                  <strong>Created By:</strong> {item.createdBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  <strong>Queued At:</strong> <br />{" "}
                  {formatDateTime(item?.createdAt as string)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  <strong>Time Elapsed:</strong> <br /> {elapsedTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShipWheel size={18} />
                <span>
                  <strong>Ship Captain:</strong> <br /> {item?.driverName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UsersRound size={18} />
                <span>
                  <strong>Capacity:</strong> <br /> {item?.capacity}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
