"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LucideIcon,
  SquareGanttChart,
  User,
  Ship,
  UserRound,
  ListOrdered,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityTypes } from "@/lib/types";
import { useState } from "react";
import { formatDateToReadable } from "@/lib/utils";

const activityIcons: Record<ActivityTypes["type"], LucideIcon> = {
  teller: User,
  boat: Ship,
  passenger: UserRound,
  queue: ListOrdered,
};

export default function ActivityTracker({
  initData,
}: {
  initData: ActivityTypes[];
}) {
  const [activities, setActivities] = useState(initData);

  return (
    <Card className="w-full border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-primary text-primary-foreground">
        <div className="flex items-center gap-1">
          <SquareGanttChart />
          <h2 className="text-xl font-semibold">Activity Tracker</h2>
        </div>
        <p className="text-sm opacity-90">
          Keeps track of the recent activities
        </p>
      </div>
      <ScrollArea className="max-h-[75vh] p-4">
        {activities.map((activity, index) => {
          const ActivityIcon = activityIcons[activity.type];
          return (
            <div key={`activity-${index}`}>
              <div className="space-y-1">
                <div className="flex justify-between items-center gap-5">
                  <div className="flex items-center space-x-1">
                    <ActivityIcon className="h-4 w-4" />
                    <h3 className="text-sm font-bold leading-none uppercase">
                      {activity.type}
                    </h3>
                  </div>
                  <span className="text-[10px]">
                    {formatDateToReadable(activity?.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.title}
                </p>
                <p className="text-sm">{activity.details}</p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="link"
                    className="p-0 h-auto cursor-pointer"
                    asChild
                  >
                    <a
                      href={activity.link}
                      className="flex items-center text-sm text-primary"
                    >
                      View Changes
                    </a>
                  </Button>
                  <Button
                    variant="link"
                    className="p-0 h-auto cursor-pointer"
                    asChild
                  >
                    <a
                      href={`/activity/${activity._id}`}
                      className="flex items-center text-sm text-primary"
                    >
                      View Details
                    </a>
                  </Button>
                </div>
              </div>
              {index < activities.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}
      </ScrollArea>
    </Card>
  );
}
