"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Ship,
  Calendar,
  Users,
  Anchor,
  MapPin,
  Users as UsersIcon,
  User,
  Trash2,
  Ellipsis,
  Info,
  Clock,
  Pin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateToReadable } from "@/lib/utils";
import { Passenger, Queue } from "@/lib/types";
import { deletePassenger, fetchPassengers } from "@/lib/api/passenger";
import { PassengerSheet } from "./PassengerSheet";
import { useToast } from "@/components/ui/use-toast";
import Alert from "@/components/utils/Alert";
import socket from "@/socket";
import { changeToSailing } from "@/lib/api/queue";
import { useSession } from "next-auth/react";
import { addNewActivity } from "@/lib/api/activity";

export default function BoardingInfo({
  boatInfo,
  elapsedTimerDisplay,
  deleteFn,
  isSailing = false,
  open,
  completed,
}: {
  boatInfo: Queue;
  elapsedTimerDisplay?: React.ReactNode;
  deleteFn: (b: boolean) => void;
  isSailing?: boolean;
  open?: boolean;
  completed?: boolean;
}) {
  const [passengers, setPassengers] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({});
  const [toSailModal, setToSailModal] = useState(false);
  const [infoOpen, setInfoOpen] = useState(open);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const { toast } = useToast();
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  const handleDeletePassenger = async (id: string, queueId: string) => {
    await deletePassenger(id, queueId);
    toast({
      title: "Deleted Successfully.",
      description: "If changes do not occur, refreshing the page might help.",
    });
    loadPassengers();
    socket.emit("boardingRefresh");
  };

  const loadPassengers = async () => {
    try {
      const req = await fetchPassengers(boatInfo.passengerIds || []);
      setPassengers(req as any);
    } catch (error) {
      setPassengers([]);
      console.log(error);
    }
  };

  const setToSailing = async () => {
    try {
      await changeToSailing(boatInfo._id as string);
      await addActivity();
      socket.emit("sailingRefresh");
      socket.emit("boardingRefresh");
      toast({
        title: "Boat Sailed.",
        description: "You can view the details on this sail on the Sails Tab.",
      });
      setInfoOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addActivity = async () => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "queue",
      title: "Boat Successfully Sailed.",
      details: `The boat named '${boatInfo.boatName}' has sailed the seas.`,
      actionBy: username,
      link: "/queue",
    });
    socket.emit("newActivity");
  };

  useEffect(() => {
    loadPassengers();
  }, [boatInfo?.passengerIds]);

  return (
    <>
      {toSailModal && (
        <Alert
          title="Set This Boat To Sail?"
          description="You might have not intended to click this."
          open={toSailModal}
          openChange={setToSailModal}
          onConfirm={setToSailing}
          primaryBtn="Sail"
          primaryClassName="bg-blue-600 hover:bg-blue-400 min-w-20"
        />
      )}
      <PassengerSheet
        open={openDetails}
        setOpenDetails={setOpenDetails}
        passengerDetails={passengerDetails as Passenger}
      />
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogTrigger asChild>
          {!open && (
            <Button
              variant="outline"
              className="text-xs md:text-sm p-0 h-max px-2 md:px-4 py-1.5"
            >
              Boat Info/List
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90dvh] sm:p-4 p-2">
          <DialogHeader className="flex items-center justify-between flex-col-reverse sm:flex-row pr-5">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Ship className="h-6 w-6" />
              Info - {boatInfo?.boatName}
            </DialogTitle>
            {elapsedTimerDisplay}
          </DialogHeader>
          <ScrollArea className="max-h-[65dvh]">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="passengers">Passengers</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Anchor className="h-5 w-5" />
                        Boat Information
                      </CardTitle>
                      <CardDescription>
                        General details about the boat
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                          <Ship className="h-4 w-4" />
                          Boat Code:
                        </span>
                        <span>{boatInfo?.boatCode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                          <UsersIcon className="h-4 w-4" />
                          Capacity:
                        </span>
                        <span>{boatInfo?.capacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Driver:
                        </span>
                        <span>{boatInfo?.driverName}</span>
                      </div>
                      {isSailing && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Current Location:
                          </span>
                          <span>
                            {boatInfo?.locationHistory?.currentLocation ||
                              "Port"}
                          </span>
                        </div>
                      )}
                      {isSailing &&
                        boatInfo?.locationHistory?.timestamps?.length > 0 && (
                          <div className="flex justify-between items-start flex-col">
                            <span className="font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Timestamps:
                            </span>
                            <div className="w-full mx-3">
                              {boatInfo?.locationHistory?.timestamps
                                ?.slice()
                                .reverse()
                                .map((stamp, idx) => {
                                  return (
                                    <div
                                      key={idx}
                                      className="flex gap-1 items-center"
                                    >
                                      <Pin size={18} />
                                      <div className="w-full flex justify-start items-start flex-col">
                                        <p className="font-bold">
                                          {stamp?.location}
                                        </p>
                                        <p className="text-[11px]">
                                          {formatDateToReadable(
                                            stamp?.timestamp
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      <div className="flex justify-center flex-col">
                        <span className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Destination:
                        </span>
                        <p className="flex items-center flex-wrap">
                          {boatInfo?.destination?.map(
                            (location: string, idx: number) => (
                              <span
                                className={`text-nowrap font-medium ${idx > 0 ? 'before:content-["-"] before:mx-1' : ""}`}
                                key={idx}
                              >
                                {location}
                              </span>
                            )
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="h-max">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Timing Information
                      </CardTitle>
                      <CardDescription>
                        Schedule and timing details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-center flex-col">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold">Queued At:</span>
                        </span>
                        {formatDateToReadable(boatInfo?.queuedAt as any)}
                      </div>
                      <div className="flex justify-center flex-col">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold">Boarding At:</span>
                        </span>
                        {formatDateToReadable(boatInfo?.boardingAt)}
                      </div>
                      <div className="flex justify-center flex-col">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold">Queued At:</span>
                        </span>
                        {formatDateToReadable(boatInfo?.createdAt as any)}
                      </div>
                      {isSailing && (
                        <div className="flex justify-center flex-col">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold">Sailed At:</span>
                          </span>
                          {formatDateToReadable(boatInfo?.sailedAt as any)}
                        </div>
                      )}
                      {completed && (
                        <div className="flex justify-center flex-col">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold">Completed At:</span>
                          </span>
                          {formatDateToReadable(boatInfo?.completedAt as any)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {!isSailing && (
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      className="block sm:hidden text-sm p-0 h-max px-2 md:px-4 py-2 min-w-24  bg-red-600 hover:bg-red-400"
                      onClick={() => deleteFn(true)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="text-sm ml-auto p-0 h-max px-2 md:px-4 py-2 min-w-24  bg-blue-600 hover:bg-blue-400"
                      onClick={() => setToSailModal(true)}
                    >
                      Sail
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="passengers">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Passenger List
                    </CardTitle>
                    <CardDescription>
                      {isSailing || completed
                        ? ""
                        : "Manage passengers for this boat"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-base">
                            Name
                          </TableHead>
                          <TableHead className="text-xs sm:text-base">
                            Age
                          </TableHead>
                          <TableHead className="text-xs sm:text-base">
                            Contact
                          </TableHead>
                          <TableHead className="text-xs sm:text-base text-center sm:text-left">
                            Amount Paid
                          </TableHead>
                          <TableHead className="text-right text-xs sm:text-base">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {passengers?.map((passenger: Passenger) => (
                          <TableRow key={passenger._id}>
                            <TableCell className="text-xs sm:text-base">
                              {`${passenger.firstName} ${passenger.lastName}`}
                            </TableCell>
                            <TableCell className="text-xs sm:text-base">
                              {passenger.age}
                            </TableCell>
                            <TableCell className="text-xs sm:text-base">
                              {passenger.phoneNumber}
                            </TableCell>
                            <TableCell className="text-xs sm:text-base">
                              {passenger.amountPaid}
                            </TableCell>
                            <TableCell className="text-right text-xs sm:text-base">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <Ellipsis className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => {
                                      setOpenDetails(true);
                                      setPassengerDetails(passenger);
                                    }}
                                  >
                                    <Info className="mr-2 h-4 w-4" />
                                    Details
                                  </DropdownMenuItem>
                                  {!isSailing && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="cursor-pointer hover:bg-accent text-red-500"
                                        onClick={() =>
                                          handleDeletePassenger(
                                            passenger._id,
                                            passenger.queueId
                                          )
                                        }
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {completed && passengers.length > 0 && (
                      <div className="text-right w-full">
                        <span className="font-bold">Total: </span>₱
                        {passengers.reduce(
                          (total, passenger: any) =>
                            total + passenger.amountPaid,
                          0
                        )}
                      </div>
                    )}
                    {passengers?.length === 0 && (
                      <div className="w-full text-center pt-4">
                        No Passengers Boarded Yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
