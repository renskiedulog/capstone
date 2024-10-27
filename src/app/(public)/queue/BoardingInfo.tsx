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
  Edit,
  Trash2,
  Ellipsis,
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
import { fetchPassengers } from "@/lib/api/passenger";

export default function BoardingInfo({
  boatInfo,
  elapsedTimerDisplay,
}: {
  boatInfo: Queue;
  elapsedTimerDisplay?: React.ReactNode;
}) {
  const [passengers, setPassengers] = useState([]);

  const handleEditPassenger = (id: string) => {
    console.log(`Edit passenger with id: ${id}`);
    // Implement edit logic here
  };

  const handleDeletePassenger = (id: string) => {
    console.log(`Delete passenger with id: ${id}`);
    // Implement delete logic here
  };

  const loadPassengers = async () => {
    try {
      const req = await fetchPassengers(boatInfo.passengerIds || []);
      setPassengers(req);
    } catch (error) {
      setPassengers([]);
      console.log(error);
    }
  };

  useEffect(() => {
    loadPassengers();
  }, [boatInfo.passengerIds]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs md:text-sm p-0 h-max px-2 md:px-4 py-1.5"
        >
          Boat Info/List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90dvh] sm:p-4 p-2">
        <DialogHeader className="flex items-center justify-between flex-col-reverse sm:flex-row pr-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Ship className="h-6 w-6" />
            Boarding Info - {boatInfo?.boatName}
          </DialogTitle>
          {elapsedTimerDisplay}
        </DialogHeader>
        <ScrollArea className="max-h-[65dvh] pr-3 over">
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
                    <div className="flex justify-center flex-col">
                      <span className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Destination:
                      </span>
                      <span>{boatInfo?.destination}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
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
                        <span className="font-bold">Created At:</span>
                      </span>
                      {formatDateToReadable(boatInfo?.createdAt as any)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="passengers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Passenger List
                  </CardTitle>
                  <CardDescription>
                    Manage passengers for this boat
                  </CardDescription>
                </CardHeader>
                <CardContent  className="px-2 sm:px-6">
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
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <Ellipsis className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleDeletePassenger(passenger._id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
  );
}
