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
      // Status priority (with "checked" at the bottom)
      const statusPriority = {
        "not-checked": 1,
        pending: 2,
        "under-inspection": 3,
        "requires-repair": 4,
        "not-sailable": 5,
        checked: 6, // checked status comes last
      };

      const statusComparison =
        statusPriority[a.checkingStatus] - statusPriority[b.checkingStatus];
      if (statusComparison !== 0) {
        return statusComparison;
      }

      // If the statuses are the same, sort by lastCheck date
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
    // Define status-to-color mapping based on your `bgColors` object
    const statusToColor: Record<string, string> = {
      "requires-repair": "bg-red-500",
      "not-sailable": "bg-gray-700",
      "under-inspection": "bg-blue-500",
      "not-checked": "bg-yellow-700",
      checked: "bg-green-500",
      pending: "bg-gray-500",
    };

    // Determine badge variant based on status and days until inspection
    const badgeColor = statusToColor[status] || "bg-gray-500"; // Fallback to gray if status is not found

    switch (status) {
      case "requires-repair":
      case "not-sailable":
        return (
          <Badge className={`uppercase text-[10px] ${badgeColor}`}>
            {status.replace("-", " ")}
          </Badge>
        );
      case "under-inspection":
      case "not-checked":
        return (
          <Badge className={`uppercase text-[10px] ${badgeColor}`}>
            {status.replace("-", " ")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className={`uppercase text-[10px] ${badgeColor}`}>
            {status.replace("-", " ")}
          </Badge>
        );
      case "checked":
        // Use daysUntilInspection to determine whether it's overdue, due soon, or on track
        if (daysUntilInspection <= 0) {
          return (
            <Badge className="uppercase text-[10px] bg-red-500">Overdue</Badge>
          );
        }
        if (daysUntilInspection <= 30) {
          return (
            <Badge className="uppercase text-[10px] bg-yellow-500">
              Due Soon
            </Badge>
          );
        }
        return (
          <Badge className={`uppercase text-[10px] ${badgeColor}`}>
            On Track
          </Badge>
        );
      default:
        return (
          <Badge className="uppercase text-[10px] bg-gray-500">Unknown</Badge>
        );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Boats Inspection Status</CardTitle>
        <CardDescription>
          View the inspection status and details of all boats.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    {new Date(boat.lastCheck).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{daysUntilInspection}</TableCell>
                  <TableCell>
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
