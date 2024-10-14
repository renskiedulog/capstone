import * as React from "react";
import { useMotionValue, Reorder, AnimatePresence } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import {
  ArrowRightSquare,
  Clock,
  Info,
  Ship,
  ShipWheel,
  Trash,
  User,
  UsersRound,
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
import Alert from "@/components/utils/Alert";
import { formatDateTime } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  item: Queue;
  setDropped: (e: boolean) => void;
  dragConstraints: React.RefObject<HTMLDivElement>;
  showInfo: string;
  setShowInfo: (e: string) => void;
  setGrabbedQueue: (e: string) => void;
  syncData: () => void;
}

export const Item = ({
  item,
  setDropped,
  dragConstraints,
  showInfo,
  setShowInfo,
  setGrabbedQueue,
  syncData,
}: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const [alert, setAlert] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState("");
  const { toast } = useToast();

  const handleDeleteQueue = async (id: string) => {
    try {
      await deleteQueueItem(id);
      socket.emit("queueRefresh");
      //TODO: Notification
      toast({
        title: "Queue Deleted Successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAlertConfirm = async () => {
    await changeToBoarding(item.id as string);
    syncData();
  };

  const handleAlertCancel = () => {
    setAlert(false);
    setGrabbedQueue("");
  };

  const getTimeElapsed = (startDate: any) => {
    const now = new Date();
    const elapsed = Math.floor((now - new Date(startDate)) / 1000); // Time in seconds

    const days = Math.floor(elapsed / (3600 * 24));
    const hours = Math.floor((elapsed % (3600 * 24)) / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    if (days > 0) {
      return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
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
      {alert && (
        <Alert
          title="Change to Boarding?"
          description="You might not have clicked or dragged on purpose."
          open={alert}
          openChange={setAlert}
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
        />
      )}
      <Reorder.Item
        value={item}
        id={item.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ boxShadow, y }}
        dragConstraints={dragConstraints}
        onMouseDown={(e: any) => {
          e.target.classList.add("cursor-grabbing");
          setGrabbedQueue(item.boatName);
        }}
        onDragEnd={(e: any) => {
          e.target.classList.remove("cursor-grabbing");
          setDropped(true);
        }}
        className="border p-2 rounded mb-1 cursor-grab bg-secondary flex items-center justify-between"
      >
        {item.boatName}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer gap-1.5 font-medium"
              onClick={() => setAlert(true)}
            >
              <ArrowRightSquare size={18} />
              <span>Board</span>
            </DropdownMenuItem>
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
