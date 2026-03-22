"use client"

import { Task, Status } from "@/app/(types)/myTypes";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GanttProvider, 
  GanttSidebar, 
  GanttSidebarGroup, 
  GanttSidebarItem, 
  GanttTimeline, 
  GanttHeader, 
  GanttFeatureList, 
  GanttFeatureListGroup, 
  GanttFeatureItem, 
  GanttToday,
  GanttFeature
} from "@/components/ui/gantt";
import { useState, useMemo, useEffect } from "react";

interface ProjectProgressProps {
  tasks: Task[];
  className?: string;
}

export default function ProjectProgress({ tasks, className }: ProjectProgressProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features: GanttFeature[] = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.map(t => {
      const startAt = t.createdAt ? new Date(t.createdAt) : new Date();
      const endAt = t.dueDate ? new Date(t.dueDate) : new Date(startAt.getTime() + 24 * 60 * 60 * 1000);
      
      const actualStart = startAt > endAt ? endAt : startAt;
      const actualEnd = startAt > endAt ? startAt : endAt;

      let color = "#3b82f6"; // blue-500
      if (t.status === Status.Completed) color = "#10b981"; // emerald-500
      else if (t.status === Status.Pending) color = "#f59e0b"; // amber-500

      return {
        id: t.taskId?.toString() || Math.random().toString(),
        name: t.title || "Untitled Task",
        startAt: actualStart,
        endAt: actualEnd,
        status: {
          id: t.status?.toString() || "todo",
          name: t.status?.toString() || "To Do",
          color
        }
      };
    });
  }, [tasks]);

  if (!tasks || tasks.length === 0) return null;

  if (!mounted) {
    return (
      <Card className={cn("w-full shadow-sm overflow-hidden border-border/50", className)}>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full shadow-sm overflow-hidden border-border/50", className)}>
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="h-5 w-5 text-primary" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full relative">
          <GanttProvider className="" range="daily" zoom={100}>
            <GanttSidebar>
              <GanttSidebarGroup name="Tasks">
                {features.map(feature => (
                  <GanttSidebarItem feature={feature} key={feature.id} />
                ))}
              </GanttSidebarGroup>
            </GanttSidebar>
            <GanttTimeline>
              <GanttHeader />
              <GanttFeatureList>
                <GanttFeatureListGroup>
                  {features.map(feature => (
                    <GanttFeatureItem key={feature.id} {...feature}>
                      <p className="flex-1 truncate text-xs font-medium pl-1">{feature.name}</p>
                    </GanttFeatureItem>
                  ))}
                </GanttFeatureListGroup>
              </GanttFeatureList>
              <GanttToday />
            </GanttTimeline>
          </GanttProvider>
        </div>
      </CardContent>
    </Card>
  );
}
