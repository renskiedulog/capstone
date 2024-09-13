"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Calendar, Target, Briefcase, LucideIcon } from "lucide-react"

interface Activity {
  id: string
  title: string
  subtitle: string
  description: string
  link: string
  type: 'completed' | 'scheduled' | 'assigned' | 'milestone'
}

const activities: Activity[] = [
  {
    id: "1",
    title: "Completed Project",
    subtitle: "Web Development",
    description: "Finished the e-commerce website redesign project.",
    link: "/projects/e-commerce",
    type: "completed"
  },
  {
    id: "2",
    title: "New Task Assigned",
    subtitle: "Mobile App",
    description: "You've been assigned to work on the new mobile app feature.",
    link: "/tasks/mobile-app",
    type: "assigned"
  },
  {
    id: "3",
    title: "Meeting Scheduled",
    subtitle: "Team Sync",
    description: "Weekly team sync meeting scheduled for tomorrow at 10 AM.",
    link: "/meetings/team-sync",
    type: "scheduled"
  },
  {
    id: "4",
    title: "Milestone Achieved",
    subtitle: "Personal Goal",
    description: "Congratulations! You've reached your monthly productivity goal.",
    link: "/goals/productivity",
    type: "milestone"
  }
]

const activityIcons: Record<Activity['type'], LucideIcon> = {
  completed: CheckCircle2,
  scheduled: Calendar,
  assigned: Briefcase,
  milestone: Target
}

export default function ActivityTracker() {
  return (
    <div className="w-full max-w-md border rounded-lg shadow-sm">
      <div className="p-4 bg-primary text-primary-foreground">
        <h2 className="text-xl font-semibold">Activity Tracker</h2>
        <p className="text-sm opacity-90">Keep track of your recent activities</p>
      </div>
      <ScrollArea className="h-[300px] p-4">
        {activities.map((activity, index) => {
          const ActivityIcon = activityIcons[activity.type]
          return (
            <div key={activity.id}>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ActivityIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium leading-none">{activity.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                <p className="text-sm">{activity.description}</p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={activity.link} className="flex items-center text-sm text-primary">
                    View activity
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
              {index < activities.length - 1 && <Separator className="my-4" />}
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}