import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Boat } from "@/lib/types";
import React from "react";

const boardingBoats = [{} as Boat];

const Boarding = ({ initData }: { initData: Boat[] }) => {
  return (
    <Card className="flex-none sm:flex-1 lg:min-w-[500px] pb-2">
      <CardHeader className="pb-2">
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        {boardingBoats?.map((board) => <BoardingBoat boat={board} />)}
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
