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
import { MapPin, Ship, ShipWheel, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BoardingInfo from "./BoardingInfo";
import Alert from "@/components/utils/Alert";
import {
  completeSail,
  fetchSailing,
  updateCurrentLocation,
} from "@/lib/api/queue";
import socket from "@/socket";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addNewActivity } from "@/lib/api/activity";

const Sailing = ({ initData }: { initData: Queue[] }) => {
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  useEffect(() => {
    socket.on("sailingRefresh", () => {
      fetchData();
    });

    return () => {
      socket.off("sailingRefresh");
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const req: any = await fetchSailing();
    setData(req);
    setLoading(false);
  };

  return (
    <Card className="flex-none sm:flex-1 lg:min-w-[500px] pb-2 h-max relative">
      <CardHeader className="pb-2 ">
        <div className="flex justify-between items-center flex-wrap">
          <CardTitle>Sailing</CardTitle>
          <p className="font-bold text-2xl">{data?.length}</p>
        </div>
        <CardDescription>All the current boats sailing.</CardDescription>
      </CardHeader>
      <div className="px-2">
        {data?.length > 0 ? (
          data?.map((boat, idx) => (
            <BoardingBoat
              key={idx}
              boat={boat}
              username={username}
              session={session}
            />
          ))
        ) : (
          <div className="text-center p-5">
            There are no boats currently on sailing.
          </div>
        )}
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-2 bg-white/50 z-50  ">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <p>Loading...</p>
        </div>
      )}
    </Card>
  );
};

export default Sailing;

const BoardingBoat = ({
  boat,
  username,
  session,
}: {
  boat: Queue;
  username: string;
  session: any;
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [capacityIndicator, setCapacityIndicator] = useState("green");
  const { toast } = useToast();

  useEffect(() => {
    if (boat.passengerIds) {
      if (boat?.passengerIds?.length === boat?.capacity) {
        setCapacityIndicator("red");
      } else {
        setCapacityIndicator("green");
      }
    }
  }, [boat.passengerIds, boat.capacity]);

  const handleCompleteSail = async () => {
    try {
      await completeSail(boat?._id);
      await addActivity();
      socket.emit("sailingRefresh");
      toast({
        title: "Sail Concluded.",
        description:
          "You can see the details on this trip on the sail history page.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addActivity = async () => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "queue",
      title: "Sail Concluded",
      details: `The boat named '${boat.boatName}''s sail has been concluded.`,
      actionBy: username,
      link: `/sail-history/${boat._id}`,
    });
    socket.emit("newActivity");
  };

  return (
    <>
      {isAlertOpen && (
        <Alert
          title="Confirm To Conclude This Sail?"
          description="You might have not clicked this on purpose."
          open={isAlertOpen}
          openChange={setIsAlertOpen}
          onConfirm={handleCompleteSail}
          primaryBtn="Conclude"
          primaryClassName="bg-green-600 hover:bg-green-400"
        />
      )}
      <div className="bg-secondary mt-1.5 p-2 rounded-md border flex items-center justify-between mb-1 w-full">
        <div className="flex w-full flex-row-reverse sm:flex-row">
          <Image
            src={boat.mainImage || "/images/default-image.jpg"}
            width={130}
            height={130}
            alt={boat?.boatName}
            className="aspect-square h-max object-cover rounded sm:w-[130px] w-[80px]"
          />
          <div className="pl-2 w-full">
            <div className="flex items-start sm:items-center w-full flex-col sm:flex-row justify-center sm:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base md:text-xl font-medium flex items-center gap-1 w-max">
                  <Ship size={18} className="min-w-[15px]" />
                  {boat?.boatName}
                </h1>
                <Badge className="uppercase !text-[8px] tracking-wider font-bold py-0.5 px-2.5 items-center justify-center">
                  {checkBoatCapacity(boat?.capacity as number)}
                </Badge>
              </div>
              <ElapsedTimeDisplay sailedAt={boat.sailedAt as string} />
            </div>
            <p className="text-sm flex items-center gap-1">
              <ShipWheel size={15} className="mb-0.5" />
              {boat?.driverName}
            </p>
            <p className="text-sm flex items-center flex-wrap">
              <MapPin size={15} className="mb-0.5 mr-1" />
              {boat?.destination?.map((location: string, idx: number) => (
                <span
                  className={`text-nowrap ${location === boat.currentLocation ? "text-blue-800 !font-bold" : "font-medium"} ${idx > 0 ? 'before:content-["-"] before:text-black before:mx-1' : ""}`}
                  key={idx}
                >
                  {location}
                </span>
              ))}
            </p>
            <p className="text-sm flex items-center gap-1">
              <Users size={15} className="mb-0.5" />
              <span
                className={
                  capacityIndicator === "red"
                    ? "text-red-700"
                    : "text-green-700"
                }
              >
                {boat?.passengerIds?.length}
              </span>
              <span
                className={capacityIndicator === "red" ? "text-red-700" : ""}
              >
                / {boat?.capacity}
              </span>
            </p>
            {/* Actions */}
            <div className="flex items-center mt-1 gap-2 flex-wrap">
              <LocationSelector
                boatName={boat?.boatName}
                boatId={boat?._id}
                destinations={boat?.destination}
                initLocation={boat?.currentLocation}
                session={session}
                username={username}
              />
              <BoardingInfo
                boatInfo={boat}
                elapsedTimerDisplay={
                  <ElapsedTimeDisplay sailedAt={boat.sailedAt as string} />
                }
                isSailing
                deleteFn={() => null}
              />
              <Button
                className="text-xs md:text-sm p-0 h-max px-2 md:px-4 py-1.5 bg-green-600 hover:bg-green-400"
                onClick={() => setIsAlertOpen(true)}
              >
                Conclude Sail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ElapsedTimeDisplay = ({ sailedAt }: { sailedAt: string }) => {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedTime(getTimeElapsed(sailedAt));
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [sailedAt]);

  return (
    <span className="sm:ml-auto text-sm text-gray-500">{elapsedTime}</span>
  );
};

function LocationSelector({
  destinations,
  initLocation,
  boatId,
  session,
  username,
  boatName,
}: {
  destinations: string[] | undefined;
  initLocation: string;
  boatId: string;
  session: any;
  username: string;
  boatName: string;
}) {
  const [currentLocation, setCurrentLocation] = useState<string>(initLocation);

  if (!destinations) return;

  const handleTagLocation = async (location: string) => {
    try {
      setCurrentLocation(location);
      await updateCurrentLocation(boatId, location);
      socket.emit("sailingRefresh");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Select value={currentLocation} onValueChange={handleTagLocation}>
      <SelectTrigger className="w-max max-w-[100px] overflow-hidden text-ellipsis text-center text-xs md:text-sm p-0 h-max px-1.5 md:px-2 py-1.5 flex gap-1 items-center">
        <MapPin className="w-4 h-4" />
        {currentLocation || "Select a location"}
      </SelectTrigger>
      <SelectContent>
        {destinations?.map((location: string, idx: number) => (
          <SelectItem location key={idx} value={location}>
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
