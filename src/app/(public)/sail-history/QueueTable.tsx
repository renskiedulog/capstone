import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This would typically come from your database
const queueData = [
  {
    id: "1",
    boatId: "BOAT001",
    status: "in-queue",
    passengerCount: 50,
    destination: ["Island A", "Island B"],
    estimatedDepartureTime: "2023-06-01T11:00:00Z",
  },
  {
    id: "2",
    boatId: "BOAT002",
    status: "boarding",
    passengerCount: 30,
    destination: ["Island C"],
    estimatedDepartureTime: "2023-06-01T12:00:00Z",
  },
  {
    id: "3",
    boatId: "BOAT003",
    status: "sailing",
    passengerCount: 40,
    destination: ["Island B"],
    departureTime: "2023-06-01T10:30:00Z",
  },
  {
    id: "4",
    boatId: "BOAT004",
    status: "completed",
    passengerCount: 45,
    destination: ["Island A"],
    departureTime: "2023-06-01T09:00:00Z",
    completedAt: "2023-06-01T11:00:00Z",
  },
  {
    id: "5",
    boatId: "BOAT005",
    status: "canceled",
    passengerCount: 20,
    destination: ["Island C"],
    canceledAt: "2023-06-01T08:30:00Z",
  },
];

const statusTabs = ["in-queue", "boarding", "sailing", "completed", "canceled"];

function QueueTable({ status }: { status: string }) {
  const filteredData = queueData.filter((item) => item.status === status);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Boat ID</TableHead>
          <TableHead>Passenger Count</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.boatId}</TableCell>
            <TableCell>{item.passengerCount}</TableCell>
            <TableCell>{item.destination.join(", ")}</TableCell>
            <TableCell>
              <Link
                href={`/page?status=${status}&id=${item.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function QueueDetails({ id }: { id: string }) {
  const queueItem = queueData.find((item) => item.id === id);

  if (!queueItem) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Details</CardTitle>
        <CardDescription>Details for Boat {queueItem.boatId}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-semibold">Status</dt>
            <dd>{queueItem.status}</dd>
          </div>
          <div>
            <dt className="font-semibold">Passenger Count</dt>
            <dd>{queueItem.passengerCount}</dd>
          </div>
          <div>
            <dt className="font-semibold">Destination</dt>
            <dd>{queueItem.destination.join(", ")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export default function Queue({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status =
    typeof searchParams?.status === "string"
      ? searchParams?.status
      : "in-queue";
  const id =
    typeof searchParams?.id === "string" ? searchParams?.id : undefined;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Queue Management</h1>
      {id ? (
        <Suspense fallback={<div>Loading...</div>}>
          <QueueDetails id={id} />
        </Suspense>
      ) : (
        <Tabs value={status} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} asChild>
                <Link href={`/page?status=${tab}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          {statusTabs.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Suspense fallback={<div>Loading...</div>}>
                <QueueTable status={tab} />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
