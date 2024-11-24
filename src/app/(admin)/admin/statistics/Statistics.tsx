"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CalendarIcon, Ship } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAverageQueueTimeByRange,
  getBoatSailCountsByRange,
  getPassengerCountWithPercentage,
  getPassengerDensityByRange,
  getQueueSummaryByRange,
  getSailsCountWithPercentage,
  getTotalFareEarnedByRange,
} from "@/lib/api/statistics";
import { StatisticsType } from "@/lib/types";
import SailsPie from "@/app/(teller)/dashboard/SailsPie";
import { PassengerTrend } from "./PassengerTrend";
import SailsTrend from "./SailsTrend";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistics({ initData }: { initData: StatisticsType }) {
  const [dateRange, setDateRange] = useState("today");
  const [statistics, setStatistics] = useState(initData);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const [
        sails,
        passengers,
        fare,
        queue,
        sailsForPie,
        passengerTrend,
        queueSummary,
      ] = await Promise.all([
        getSailsCountWithPercentage(dateRange),
        getPassengerCountWithPercentage(dateRange),
        getTotalFareEarnedByRange(dateRange),
        getAverageQueueTimeByRange(dateRange),
        getBoatSailCountsByRange(dateRange),
        getPassengerDensityByRange(dateRange),
        getQueueSummaryByRange(dateRange),
      ]);
      setStatistics({
        sails,
        passengers,
        fare,
        queue,
        sailsForPie,
        passengerTrend,
        queueSummary,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage > 0) return "text-green-500";
    if (percentage < 0) return "text-red-500";
    return "text-yellow-500";
  };

  const rangeMapping: { [key: string]: string } = {
    today: "yesterday",
    "this-week": "last week",
    "this-month": "last month",
    "this-year": "last year",
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="max-w-[180px]">
              <CalendarIcon className="h-4 w-4 text-black mr-2" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sails</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.sails.currentCount.toLocaleString()}
            </div>
            <p
              className={`text-xs ${getPercentageColor(statistics.sails.percentageDifference)}`}
            >
              {(statistics.sails.percentageDifference >= 0 ? "+" : "") +
                statistics.sails.percentageDifference.toFixed(2)}
              % from {rangeMapping[dateRange] || ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Passengers
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.passengers.currentCount.toLocaleString()}
            </div>
            <p
              className={`text-xs ${getPercentageColor(statistics.passengers.percentageDifference)}`}
            >
              {(statistics.passengers.percentageDifference >= 0 ? "+" : "") +
                statistics.passengers.percentageDifference.toFixed(2)}
              % from {rangeMapping[dateRange] || ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{statistics.fare.currentTotal.toLocaleString()}
            </div>
            <p
              className={`text-xs ${getPercentageColor(statistics.fare.percentageDifference)}`}
            >
              {(statistics.fare.percentageDifference >= 0 ? "+" : "") +
                statistics.fare.percentageDifference.toFixed(2)}
              % from {rangeMapping[dateRange] || ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Queue Time
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.queue.current.hours !== 0
                ? `${statistics.queue.current.hours} hours`
                : `${statistics.queue.current.minutes} minutes`}
            </div>
            <p
              className={`text-xs ${getPercentageColor(statistics.queue.percentageDifference)}`}
            >
              {(statistics.queue.percentageDifference >= 0 ? "+" : "") +
                statistics.queue.percentageDifference.toFixed(2)}
              % from {rangeMapping[dateRange] || ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <PassengerTrend
          chartData={statistics.passengerTrend as any}
          trend={statistics.passengers}
          rangeMapping={rangeMapping}
          dateRange={dateRange}
          getPercentageColor={getPercentageColor}
        />
        <SailsTrend data={statistics.queueSummary} />
        <SailsPie initData={statistics?.sailsForPie} dateRange={dateRange} />
      </div>
    </section>
  );
}
