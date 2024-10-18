import React from "react";
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
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample passenger data
const passengers = [
  { id: 1, name: "John Doe", age: 35, ticketNumber: "T001" },
  { id: 2, name: "Jane Smith", age: 28, ticketNumber: "T002" },
  { id: 3, name: "Mike Johnson", age: 42, ticketNumber: "T003" },
  { id: 4, name: "Emily Brown", age: 31, ticketNumber: "T004" },
  { id: 5, name: "David Lee", age: 39, ticketNumber: "T005" },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function BoatInfoDialog() {
  const boatInfo = {
    _id: "670f1932fb89dec1a070bdb1",
    boatId: "670907abcc5da00587c90d5e",
    position: null,
    status: "boarding",
    passengerIds: [],
    createdBy: "admin",
    queuedAt: "2024-10-16T01:38:58.584Z",
    createdAt: "2024-10-16T01:38:58.585Z",
    updatedAt: "2024-10-16T01:46:30.186Z",
    __v: 0,
    boardingAt: "2024-10-16T01:46:30.185Z",
    destination: "Some Small Island",
    mainImage: "data:image/jpeg;base64",
    capacity: 35,
    boatName: "Bayani ng Dagat",
    boatCode: "PB0023",
    driverName: "Mark Santos",
  };

  const handleEditPassenger = (id: number) => {
    console.log(`Edit passenger with id: ${id}`);
    // Implement edit logic here
  };

  const handleDeletePassenger = (id: number) => {
    console.log(`Delete passenger with id: ${id}`);
    // Implement delete logic here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Boat Information</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Ship className="h-6 w-6" />
            Boat Information: {boatInfo.boatName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)]">
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
                      <span>{boatInfo.boatCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {boatInfo.status}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Destination:
                      </span>
                      <span>{boatInfo.destination}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        Capacity:
                      </span>
                      <span>{boatInfo.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Driver:
                      </span>
                      <span>{boatInfo.driverName}</span>
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
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Queued At:</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(boatInfo.queuedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Boarding At:</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(boatInfo.boardingAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Created At:</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(boatInfo.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Updated At:</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(boatInfo.updatedAt)}
                      </span>
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
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Ticket Number</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passengers.map((passenger) => (
                        <TableRow key={passenger.id}>
                          <TableCell>{passenger.name}</TableCell>
                          <TableCell>{passenger.age}</TableCell>
                          <TableCell>{passenger.ticketNumber}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <Users className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEditPassenger(passenger.id)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeletePassenger(passenger.id)
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
