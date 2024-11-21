"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

export default function LineChartCard({ initData }) {
  const [densityData, setDensityData] = useState<
    { date: string; count: number }[] | null
  >(initData);

  const totalPassengers =
    densityData?.reduce((total, day) => total + day.count, 0) || 0;
  const averagePassengers = totalPassengers / 5 || 0;
  
  return (
    <Card className="flex flex-col w-full lg:w-1/2">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
        <div>
          <CardDescription className="flex flex-col">
            <span className="text-[10px] font-bold">5 day span</span>
            Total Passengers
          </CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {totalPassengers}
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              passengers
            </span>
          </CardTitle>
        </div>
        <div>
          <CardDescription className="flex flex-col">
            <span className="text-[10px] font-bold">5 day span</span>
            Average Passengers
          </CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {averagePassengers}
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              passengers
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            count: {
              label: "count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="w-full h-[160px]"
        >
          <LineChart
            accessibilityLayer
            margin={{
              left: 14,
              right: 14,
              top: 10,
            }}
            data={densityData}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Line
              dataKey="count"
              type="natural"
              fill="var(--color-count)"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: "var(--color-count)",
                stroke: "var(--color-count)",
                r: 4,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
