"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

export default function SailsPie({ initData }: any) {
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const generateChartConfig = (boatData: any) => {
    const chartData: any = [];
    const chartConfig: any = {
      sails: {
        label: "Total Sails",
      },
    };

    boatData.forEach((boat: any, index: number) => {
      const color = chartColors[index % chartColors.length];

      chartData.push({
        boatName: boat.boatName,
        sailCount: boat.sailCount,
        fill: color,
      });

      chartConfig[boat.boatId] = {
        label: boat.boatName,
        color: color,
      };
    });

    return { chartData, chartConfig };
  };

  const { chartData, chartConfig } = generateChartConfig(initData);

  const totalSails = chartData.reduce((sum: any, boat: any) => sum + boat.sailCount, 0);

  return (
    <Card className="flex flex-col lg:w-1/2 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Sails</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent className={`flex-1 pb-0 min-h-[230px] ${chartData?.length === 0 && "flex items-center justify-center"}`}>
        {chartData?.length > 0 ?         <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="sailCount" // Matches the key for the count of sails
              nameKey="boatName" // Matches the key for the boat name
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSails.toLocaleString()} {/* Total sails */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sails {/* Update the label to "Sails" */}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer> : "There are no sails found."}
      </CardContent>
    </Card>
  );
}
