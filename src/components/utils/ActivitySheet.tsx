"use client";

import { format } from "date-fns";
import {
  Anchor,
  CalendarIcon,
  FileTextIcon,
  InfoIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ActivityTypes } from "@/lib/types";
import Link from "next/link";
import { formatDateToReadable } from "@/lib/utils";

interface SheetTypes {
  open?: boolean;
  setOpenDetails: (e: boolean) => void;
  activityDetails: ActivityTypes | null;
}

export function ActivitySheet({
  open,
  setOpenDetails,
  activityDetails,
}: SheetTypes) {
  if (!activityDetails) return null;

  const details = [
    { icon: TagIcon, label: "Type", value: activityDetails.type },
    { icon: FileTextIcon, label: "Title", value: activityDetails.title },
    { icon: InfoIcon, label: "Details", value: activityDetails.details },
    { icon: UserIcon, label: "Action By", value: activityDetails.actionBy },
    {
      icon: Anchor,
      label: "Link",
      value: activityDetails?.value && (
        <Link
          href={activityDetails.link}
          className="text-primary hover:underline"
        >
          View Details
        </Link>
      ),
    },
    {
      icon: CalendarIcon,
      label: "Date",
      value: formatDateToReadable(activityDetails.createdAt),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpenDetails}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Activity Details</SheetTitle>
          <SheetDescription>
            The recent activity information and timestamp.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-3">
              <detail.icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {detail.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {typeof detail.value === "string"
                    ? detail.value
                    : detail.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
