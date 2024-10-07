import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import BoardingBoat from "./BoardingBoat";

const boardingBoats = ["asd", "asd"];

const Boarding = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Boarding</CardTitle>
        <CardDescription>
          All the current boats boarding passengers.
        </CardDescription>
        <CardContent className="p-0">
          {boardingBoats?.map((board) => <BoardingBoat />)}
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default Boarding;
