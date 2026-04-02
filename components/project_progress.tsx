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
  projectStartDate?: Date;
  projectEndDate?: Date;
  className?: string;
  onTaskDateChange?: (taskId: number, newDueDate: Date) => void;
  rollbackCounter?: number;
}
export default function ProjectProgress({ tasks, projectStartDate, projectEndDate, className, onTaskDateChange, rollbackCounter }: ProjectProgressProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const actualStartDate = useMemo(() => {
    if (projectStartDate) return projectStartDate;
    if (!tasks || tasks.length === 0) return new Date();
    return tasks.reduce((min, t) => {
      const d = t.createdAt ? new Date(t.createdAt) : new Date();
      return d < min ? d : min;
    }, new Date(8640000000000000));
  }, [projectStartDate, tasks]);

  const actualEndDate = useMemo(() => {
    if (projectEndDate) return projectEndDate;
    if (!tasks || tasks.length === 0) return new Date();
    return tasks.reduce((max, t) => {
      const d = t.completionDate ? new Date(t.completionDate) : (t.dueDate ? new Date(t.dueDate) : new Date());
      return d > max ? d : max;
    }, new Date(-8640000000000000));
  }, [projectEndDate, tasks]);

  const features: GanttFeature[] = useMemo(() => {
    if (!tasks) return [];

    return tasks.map(t => {
      const startAt = t.createdAt ? new Date(t.createdAt) : new Date();
      const baseEndDate = t.dueDate ? new Date(t.dueDate) : new Date(startAt.getTime());
      const endAt = new Date(baseEndDate.getTime() + 24 * 60 * 60 * 1000); // Exclusive bound for proper Gantt rendering

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
  }, [tasks, rollbackCounter]);

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
      <CardHeader className="border-b bg-muted/20 pb-4 ">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="h-5 w-5 text-primary" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full relative">
          <GanttProvider className="" range="daily" zoom={100} startDate={actualStartDate} endDate={actualEndDate}>
            <GanttSidebar>
              <GanttSidebarGroup name="Tasks" >
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
                    <GanttFeatureItem 
                      key={feature.id} 
                      {...feature}
                      onMove={onTaskDateChange ? (id, dragStart, dragEnd) => {
                          if (dragEnd) {
                              const correctedDueDate = new Date(dragEnd);
                              correctedDueDate.setDate(correctedDueDate.getDate() - 1);
                              onTaskDateChange(Number(id), correctedDueDate);
                          }
                      } : undefined}
                    >
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
