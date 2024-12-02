"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";

type Boat = {
  _id: string;
  boatName: string;
  lastCheck: string;
  checkingStatus: string;
  status: string;
};

export default function LastChecked({ boats }: { boats: Boat[] }) {
  const [sortedBoats, setSortedBoats] = useState<Boat[]>([]);

  useEffect(() => {
    const sorted = [...boats].sort((a, b) => {
      const statusPriority = {
        "not-checked": 1,
        pending: 2,
        "under-inspection": 3,
        "requires-repair": 4,
        "not-sailable": 5,
        checked: 6,
      };

      const statusComparison =
        statusPriority[a.checkingStatus] - statusPriority[b.checkingStatus];
      if (statusComparison !== 0) {
        return statusComparison;
      }

      const dateA = new Date(a.lastCheck);
      const dateB = new Date(b.lastCheck);
      return dateA.getTime() - dateB.getTime();
    });
    setSortedBoats(sorted);
  }, [boats]);

  const calculateDaysUntilInspection = (lastCheck: string) => {
    const lastCheckDate = new Date(lastCheck);
    const nextInspectionDate = new Date(
      lastCheckDate.setFullYear(lastCheckDate.getFullYear() + 1)
    );
    const today = new Date();
    const diffTime = nextInspectionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (daysUntilInspection: number, status: string) => {
    const statusToColor: Record<string, string> = {
      "requires-repair": "bg-red-500",
      "not-sailable": "bg-gray-700",
      "under-inspection": "bg-blue-500",
      "not-checked": "bg-yellow-700",
      checked: "bg-green-500",
      pending: "bg-gray-500",
    };

    const badgeColor = statusToColor[status] || "bg-gray-500"; // Fallback to gray if status is not found

    switch (status) {
      case "requires-repair":
      case "not-sailable":
        return (
          <Badge
            className={`uppercase hover:${badgeColor} whitespace-nowrap text-center text-[10px] ${badgeColor}`}
          >
            {status.replace("-", " ")}
          </Badge>
        );
      case "under-inspection":
      case "not-checked":
        return (
          <Badge
            className={`uppercase hover:${badgeColor} whitespace-nowrap text-center text-[10px] ${badgeColor}`}
          >
            {status.replace("-", " ")}
          </Badge>
        );
      case "pending":
        return (
          <Badge
            className={`uppercase hover:${badgeColor} whitespace-nowrap text-center text-[10px] ${badgeColor}`}
          >
            {status.replace("-", " ")}
          </Badge>
        );
      case "checked":
        if (daysUntilInspection <= 0) {
          return (
            <Badge className="uppercase whitespace-nowrap text-center text-[10px] bg-red-500">
              Overdue
            </Badge>
          );
        }
        if (daysUntilInspection <= 30) {
          return (
            <Badge className="uppercase whitespace-nowrap text-center text-[10px] bg-yellow-500">
              Due Soon
            </Badge>
          );
        }
        return (
          <Badge
            className={`uppercase hover:${badgeColor} whitespace-nowrap text-center text-[10px] ${badgeColor}`}
          >
            On Track
          </Badge>
        );
      default:
        return (
          <Badge className="uppercase whitespace-nowrap text-center text-[10px] bg-gray-500">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Boats Inspection Status</CardTitle>
        <CardDescription>
          View the inspection status and details of all boats.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boat Name</TableHead>
              <TableHead>Last Inspection</TableHead>
              <TableHead>Days Until Next Inspection</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBoats.map((boat, idx) => {
              if (idx > 10) return;
              const daysUntilInspection = calculateDaysUntilInspection(
                boat.lastCheck
              );
              return (
                <TableRow key={boat._id}>
                  <TableCell className="font-medium">{boat.boatName}</TableCell>
                  <TableCell>
                    {boat?.lastCheck
                      ? new Date(boat.lastCheck).toLocaleDateString()
                      : "Not Yet Inspected."}
                  </TableCell>
                  <TableCell>{daysUntilInspection}</TableCell>
                  <TableCell className="flex items-center justify-center sm:justify-start">
                    {getStatusBadge(daysUntilInspection, boat.status)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {sortedBoats.length === 0 && (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            No boats currently in the system.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
