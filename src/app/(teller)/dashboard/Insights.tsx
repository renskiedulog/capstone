"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import { getQueueInsights } from "@/lib/api/statistics";
import { DestinationOptions } from "@/lib/constants";

export default function QueueInsightsCard({ initData }) {
  const [insights, setInsights] = useState<{
    mostVisitedDestination: string;
    busiestMonth: number | string;
  } | null>(initData);

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getQueueInsights();
      setInsights(data);
    };
    fetchInsights();
  }, []);

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Queue Insights</CardTitle>
        <CardDescription>Overview of passenger trends</CardDescription>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">
                  Most Visited Destination
                </p>
                <p className="text-sm text-muted-foreground">
                  {DestinationOptions?.find(
                    (k) => k.value === insights?.mostVisitedDestination
                  )?.label ?? insights?.mostVisitedDestination}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">
                  Busiest Month
                </p>
                <p className="text-sm text-muted-foreground">
                  {typeof insights.busiestMonth === "number"
                    ? getMonthName(insights.busiestMonth)
                    : insights.busiestMonth}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading insights...</p>
        )}
      </CardContent>
    </Card>
  );
}
