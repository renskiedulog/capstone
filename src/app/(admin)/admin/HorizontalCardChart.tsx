"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import socket from "@/socket";
import { getQueueSummary } from "@/lib/api/statistics";

export type QueueSummaryData = {
  formattedData: {
    status: string;
    count: number;
    totalPassengers: number;
    latestDeparture: string;
  }[];
  totalQueued: number;
  totalPassengers: number;
  totalFareEarned: number;
};

export default function HorizontalCardChart({
  initData,
}: {
  initData: QueueSummaryData;
}) {
  const [data, setData] = useState(initData);

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      fetchData();
    }, 10000);

    socket.on("boardingRefresh", () => {
      fetchData();
    });
    socket.on("queueRefresh", () => {
      fetchData();
    });
    socket.on("sailingRefresh", () => {
      fetchData();
    });

    return () => {
      clearInterval(fetchInterval);
      socket.off("boardingRefresh");
      socket.off("queueRefresh");
      socket.off("sailingRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req = await getQueueSummary();
    setData(req as QueueSummaryData);
  };

  return (
    <Card className="w-full lg:w-1/2">
      <CardHeader className="pb-2">
        <CardTitle>Queue Summary</CardTitle>
        <CardDescription>
          Overview of boat statuses in queue and passengers.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={{
            "in-queue": { label: "Queueing", color: "hsl(var(--chart-1))" },
            boarding: { label: "Boarding", color: "hsl(var(--chart-2))" },
            sailing: { label: "Sailing", color: "hsl(var(--chart-3))" },
            completed: { label: "Completed", color: "hsl(var(--chart-4))" },
          }}
          className="h-[160px] w-full"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 15,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                status: "in-queue",
                value:
                  ((data.formattedData.find((d) => d.status === "in-queue")
                    ?.count || 0) /
                    data.totalQueued) *
                  100,
                label: `${data.formattedData.find((d) => d.status === "in-queue")?.count || 0} boats`,
                fill: "var(--color-in-queue)",
              },
              {
                status: "boarding",
                value:
                  ((data.formattedData.find((d) => d.status === "boarding")
                    ?.count || 0) /
                    data.totalQueued) *
                  100,
                label: `${data.formattedData.find((d) => d.status === "boarding")?.count || 0} boats`,
                fill: "var(--color-boarding)",
              },
              {
                status: "sailing",
                value:
                  ((data.formattedData.find((d) => d.status === "sailing")
                    ?.count || 0) /
                    data.totalQueued) *
                  100,
                label: `${data.formattedData.find((d) => d.status === "sailing")?.count || 0} boats`,
                fill: "var(--color-sailing)",
              },
              {
                status: "completed",
                value:
                  ((data.formattedData.find((d) => d.status === "completed")
                    ?.count || 0) /
                    data.totalQueued) *
                  100,
                label: `${data.formattedData.find((d) => d.status === "completed")?.count || 0} boats`,
                fill: "var(--color-completed)",
              },
            ]}
            layout="vertical"
            barSize={32}
            barGap={2}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              className="capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
        <div className="flex w-full items-center gap-2 w-max">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Total Boats</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data.totalQueued}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Total Passengers
            </div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data.totalPassengers}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5 w-full">
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Total Fare Earned
            </div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data.totalFareEarned}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
