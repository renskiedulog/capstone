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

export type QueueSummaryData = {
  averageQueueTime: number;
  averageBoardingTime: number;
  averageSailingTime: number;
  totalBoats: number;
  longestTime: string;
  earliestTime: string;
};

export default function SailsTrend({
  data,
  className,
}: {
  data: QueueSummaryData;
  className?: string;
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Queue Summary</CardTitle>
        <CardDescription>
          Overview of boat statuses and time metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={{
            avgQueue: {
              label: "Avg. Queue Time",
              color: "hsl(var(--chart-1))",
            },
            avgSail: {
              label: "Avg. Sailing Time",
              color: "hsl(var(--chart-2))",
            },
            avgBoard: {
              label: "Avg. Boarding Time",
              color: "hsl(var(--chart-3))",
            },
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
                status: "avg. Queue Time",
                value: data?.averageQueueTime || 0,
                label: `${data?.averageQueueTime.toFixed(2)} secs`,
                fill: "var(--color-avgQueue)",
              },
              {
                status: "avg. Board Time",
                value: data?.averageBoardingTime || 0,
                label: `${data?.averageBoardingTime.toFixed(2)} secs`,
                fill: "var(--color-avgBoard)",
              },
              {
                status: "avg. Sail Time",
                value: data?.averageSailingTime || 0,
                label: `${data?.averageSailingTime.toFixed(2)} secs`,
                fill: "var(--color-avgSail)",
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
        <div className="flex flex-wrap items-center gap-2 w-max">
          <div className="grid auto-rows-min gap-0.5">
            <div className="text-[10px] sm:text-xs whitespace-nowrap text-muted-foreground">
              Total Boats
            </div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data?.totalBoats || 0}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-[10px] sm:text-xs whitespace-nowrap text-muted-foreground">
              Longest Time
            </div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data?.longestTime || 0}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid auto-rows-min gap-0.5 ">
            <div className="text-[10px] sm:text-xs whitespace-nowrap text-muted-foreground">
              Earliest Time
            </div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {data?.earliestTime || 0}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
