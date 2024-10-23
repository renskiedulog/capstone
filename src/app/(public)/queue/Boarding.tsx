"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkBoatCapacity } from "@/lib/constants";
import { Queue } from "@/lib/types";
import { getTimeElapsed } from "@/lib/utils";
import { Info, MapPin, Ship, ShipWheel, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BoardingInfo from "./BoardingInfo";
import Alert from "@/components/utils/Alert";
import { deleteBoarding, fetchBoarding } from "@/lib/api/queue";
import socket from "@/socket";
import { useSession } from "next-auth/react";
import { addNewActivity } from "@/lib/api/activity";
import AddPassenger from "./AddPassenger";

const Boarding = ({ initData }: { initData: Queue[] }) => {
  const [data, setData] = useState(initData);
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  useEffect(() => {
    socket.on("queueRefresh", () => {
      fetchData();
    });

    return () => {
      socket.off("queueRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req: any = await fetchBoarding();
    setData(req);
  };

  return (
    <Card className="flex-none sm:flex-1 lg:min-w-[500px] pb-2 h-max">
      <CardHeader className="pb-2">
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        {data?.length > 0 ? (
          data?.map((boat, idx) => (
            <BoardingBoat key={idx} boat={boat} username={username} />
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
  username,
}: {
  boat: Queue;
  username: string;
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const addActivity = async () => {
    await addNewActivity({
      type: "queue",
      title: "Deleted Boarding Boat",
      details: `Boat with the name '${boat?.boatName}' has been deleted from the boarding queue.`,
      link: `/boat/${boat?.boatCode}`,
      actionBy: username,
    });
    socket.emit("newActivity");
  };

  const handleAlertConfirm = async () => {
    await deleteBoarding(boat._id);
    addActivity();
    socket.emit("queueRefresh");
  };

  return (
    <>
      {isAlertOpen && (
        <Alert
          title="Confirm To Delete?"
          description="The data inside this document will not be saved and any related data will be deleted."
          open={isAlertOpen}
          openChange={setIsAlertOpen}
          onConfirm={handleAlertConfirm}
          primaryBtn="Delete"
          primaryClassName="bg-red-600 hover:bg-red-400"
        />
      )}
      <div className="bg-secondary mt-1.5 p-2 rounded-md border flex items-center justify-between mb-1 w-full">
        <div className="flex w-full">
          <Image
            src={boat.mainImage || "/images/default-image.jpg"}
            width={130}
            height={130}
            alt={boat?.boatName}
            className="aspect-square object-cover rounded md:w-[130px] w-[100px]"
          />
          <div className="px-2 w-full">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-medium flex items-center gap-1">
                  <Ship size={18} />
                  {boat?.boatName}
                </h1>
                <Badge className="uppercase !text-[8px] tracking-wider font-bold py-0.5 px-2.5 items-center justify-center">
                  {checkBoatCapacity(boat?.capacity as number)}
                </Badge>
              </div>
              <ElapsedTimeDisplay boardingAt={boat.boardingAt as string} />
            </div>
            <p className="text-sm flex items-center gap-1">
              <ShipWheel size={15} className="mb-0.5" />
              {boat?.driverName}
            </p>
            <p className="text-sm flex items-center gap-1">
              <MapPin size={15} className="mb-0.5" />
              {boat?.destination}
            </p>
            <p className="text-sm flex items-center gap-1">
              <Users size={15} className="mb-0.5" />
              <span>
                {boat?.passengerIds?.length} / {boat?.capacity}
              </span>
            </p>
            {/* Actions */}
            <div className="flex items-center mt-1 gap-x-2">
              <AddPassenger queueId={boat._id} />
              <BoardingInfo
                boatInfo={boat}
                elapsedTimerDisplay={
                  <ElapsedTimeDisplay boardingAt={boat.boardingAt as string} />
                }
              />
              <Button
                className="text-xs md:text-sm p-0 h-max px-2 md:px-4 py-1.5 bg-red-600 hover:bg-red-400"
                onClick={() => setIsAlertOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ElapsedTimeDisplay = ({ boardingAt }: { boardingAt: string }) => {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedTime(getTimeElapsed(boardingAt));
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [boardingAt]);

  return <span className="ml-auto text-sm text-gray-500">{elapsedTime}</span>;
};
