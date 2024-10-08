"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ActivityTypes } from "@/lib/types";

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
  return (
    <Sheet open={open} onOpenChange={setOpenDetails}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Activity Details</SheetTitle>
          <SheetDescription>
            The recent activity information and timestamp.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">

        </div>
      </SheetContent>
    </Sheet>
  );
}
