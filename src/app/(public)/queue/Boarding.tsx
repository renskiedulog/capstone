import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const boardingBoats = ["asd", "asd"];

const Boarding = ({ initData }: any) => {
  return (
    <Card className="flex-1 lg:min-w-[500px]">
      <CardHeader className="pb-2">
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        {boardingBoats?.map((board) => <BoardingBoat boats={board} />)}
      </div>
    </Card>
  );
};

export default Boarding;

const BoardingBoat = ({ boats }) => {
  return (
    <div className="bg-secondary mt-1.5 p-2 rounded-md border">
      BoardingBoat
    </div>
  );
};
