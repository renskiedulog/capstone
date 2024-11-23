"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PassengerTrend({
  chartData,
  trend,
  rangeMapping,
  dateRange,
  getPercentageColor,
}: any) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Passenger Density Trend</CardTitle>
        <CardDescription>
          Dynamic trends based on selected range
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 30,
              right: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <p
          className={`text-xs font-bold ${getPercentageColor(trend.percentageDifference)}`}
        >
          Current Trend: {(trend.percentageDifference >= 0 ? "+" : "") +
            trend.percentageDifference.toFixed(2)}
          % from {rangeMapping[dateRange] || ""}
        </p>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for{" "}
          {dateRange === "today"
            ? "today."
            : dateRange === "this-week"
              ? "this week."
              : dateRange === "this-month"
                ? "this month."
                : dateRange === "this-year"
                  ? "this year."
                  : "today."}
        </div>
      </CardFooter>
    </Card>
  );
}
