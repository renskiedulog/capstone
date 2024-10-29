"use client";

import {
  Anchor,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  Info,
  InfoIcon,
  PhoneIcon,
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
import { ActivityTypes, Passenger } from "@/lib/types";
import Link from "next/link";
import { formatDateToReadable } from "@/lib/utils";

interface SheetTypes {
  open?: boolean;
  setOpenDetails: (e: boolean) => void;
  passengerDetails: Passenger | null;
}

export function PassengerSheet({
  open,
  setOpenDetails,
  passengerDetails,
}: SheetTypes) {
  if (!passengerDetails) return null;

  const details = [
    {
      icon: UserIcon,
      label: "Name",
      value: `${passengerDetails?.firstName} ${passengerDetails?.lastName}`,
    },
    { icon: CalendarIcon, label: "Age", value: passengerDetails?.age },
    { icon: InfoIcon, label: "Gender", value: passengerDetails?.gender },
    {
      icon: PhoneIcon,
      label: "Phone Number",
      value: passengerDetails?.phoneNumber,
    },
    { icon: Anchor, label: "Queue ID", value: passengerDetails?.queueId },
    {
      icon: DollarSignIcon,
      label: "Amount Paid",
      value: `${passengerDetails?.amountPaid?.toFixed(2)}`,
    },
    { icon: UserIcon, label: "Added By", value: passengerDetails?.addedBy },
    {
      icon: CalendarIcon,
      label: "Date Added",
      value: passengerDetails?.createdAt
        ? formatDateToReadable(passengerDetails?.createdAt)
        : "N/A",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpenDetails}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info size={18} />
            Passenger Details
          </SheetTitle>
          <SheetDescription>
            The passenger's detailed information.
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
