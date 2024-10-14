"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Boat } from "@/lib/types";
import React from "react";

const Boarding = ({ initData }: { initData: Boat[] }) => {
  console.log(initData);
  return (
    <Card className="flex-none sm:flex-1 lg:min-w-[500px] pb-2 h-max">
      <CardHeader className="pb-2">
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        {initData?.length > 0 ? (
          initData?.map((boat, idx) => <BoardingBoat key={idx} boat={boat} />)
        ) : (
          <div className="text-center p-5">
            There are no boats currently on boarding.
          </div>
        )}
      </div>
    </Card>
  );
};

export default Boarding;

const BoardingBoat = ({ boat }: { boat: Boat }) => {
  return (
    <div className="bg-secondary mt-1.5 p-2 rounded-md border">
      BoardingBoat
    </div>
  );
};
