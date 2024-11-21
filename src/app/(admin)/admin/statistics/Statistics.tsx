"use client";

import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
import { CalendarIcon, Ship, Users, DollarSign, Clock } from "lucide-react";

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
  getSailsCountWithPercentage,
  getTotalFareEarnedByRange,
} from "@/lib/api/statistics";
import { StatisticsType } from "@/lib/types";
import SailsPie from "@/app/(teller)/dashboard/SailsPie";
import { PassengerTrend } from "./PassengerTrend";

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
      const [sails, passengers, fare, queue, sailsForPie, passengerTrend] =
        await Promise.all([
          getSailsCountWithPercentage(dateRange),
          getPassengerCountWithPercentage(dateRange),
          getTotalFareEarnedByRange(dateRange),
          getAverageQueueTimeByRange(dateRange),
          getBoatSailCountsByRange(dateRange),
          getPassengerDensityByRange(dateRange),
        ]);
      setStatistics({
        sails,
        passengers,
        fare,
        queue,
        sailsForPie,
        passengerTrend,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sailsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Number of Sails",
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const customerTypeData = {
    labels: ["New", "Returning", "Regular"],
    datasets: [
      {
        data: [300, 150, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
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
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sails">Sails</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PassengerTrend
              chartData={statistics.passengerTrend as any}
              trend={statistics.passengers}
              rangeMapping={rangeMapping}
              dateRange={dateRange}
              getPercentageColor={getPercentageColor}
            />
            <Card>
              <CardHeader>
                <CardTitle>Sails Overview</CardTitle>
                <CardDescription>
                  Number of sails per day this week
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Bar data={sailsData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sail Types Distribution</CardTitle>
              <CardDescription>
                Distribution of different types of sails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <SailsPie initData={statistics?.sailsForPie} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Types</CardTitle>
              <CardDescription>Distribution of customer types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Pie data={customerTypeData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Sail Type</CardTitle>
              <CardDescription>
                Revenue distribution across different sail types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: [
                    "Day Sails",
                    "Sunset Cruises",
                    "Private Charters",
                    "Fishing Trips",
                  ],
                  datasets: [
                    {
                      label: "Revenue",
                      data: [4000, 3000, 5000, 2000],
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
