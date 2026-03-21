import { Task, Status } from "@/app/(types)/myTypes";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProjectProgressProps {
  tasks: Task[];
  className?: string;
}

const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function ProjectProgress({ tasks, className }: ProjectProgressProps) {
  if (!tasks || tasks.length === 0) return null;

  let minDate = new Date();
  let maxDate = new Date();
  
  tasks.forEach((task, index) => {
    const start = task.createdAt ? new Date(task.createdAt) : new Date();
    const end = task.dueDate ? new Date(task.dueDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000);
        
    const actualStart = start > end ? end : start;
    const actualEnd = start > end ? start : end;

    if (index === 0) {
        minDate = actualStart;
        maxDate = actualEnd;
    } else {
        if (actualStart < minDate) minDate = actualStart;
        if (actualEnd > maxDate) maxDate = actualEnd;
    }
  });

  // Adding padding to timeline
  minDate = new Date(minDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  maxDate = new Date(maxDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  
  const totalDuration = maxDate.getTime() - minDate.getTime();
  const durationMs = totalDuration === 0 ? 1 : totalDuration;

  // Generate date markers
  const dateMarkers = [];
  const daysCount = Math.ceil(totalDuration / (24 * 60 * 60 * 1000));
  const maxMarkers = 8;
  const step = Math.max(1, Math.ceil(daysCount / maxMarkers));

  for (let i = 0; i <= daysCount; i += step) {
      dateMarkers.push(new Date(minDate.getTime() + i * 24 * 60 * 60 * 1000));
  }

  // Ensure last marker is covered
  if (dateMarkers[dateMarkers.length - 1].getTime() < maxDate.getTime()) {
      dateMarkers.push(new Date(maxDate.getTime()));
  }

  return (
    <Card className={cn("w-full shadow-sm overflow-hidden border-border/50", className)}>
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="h-5 w-5 text-primary" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px] p-6 pb-2">
          
          {/* Header & Date Markers */}
          <div className="flex border-b border-border/50 pb-2 mb-4 relative z-10 w-full">
            <div className="w-[220px] shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-4">
                 Task Details
            </div>
            <div className="flex-1 relative h-6">
                {dateMarkers.map((marker, i) => {
                    const leftPercent = ((marker.getTime() - minDate.getTime()) / durationMs) * 100;
                    return (
                        <div key={i} className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${leftPercent}%` }}>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                {formatDateShort(marker)}
                            </span>
                        </div>
                    )
                })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex relative w-full items-stretch">
            
            {/* Grid Lines Overlay */}
            <div className="absolute top-[-16px] bottom-0 left-[220px] right-0 z-0 pointer-events-none">
                 {dateMarkers.map((marker, i) => {
                     const leftPercent = ((marker.getTime() - minDate.getTime()) / durationMs) * 100;
                     return (
                         <div key={i} className="absolute top-0 bottom-0 border-l border-border/40 border-dashed" style={{ left: `${leftPercent}%` }} />
                     )
                 })}
            </div>

            {/* Task Rows */}
            <div className="flex flex-col space-y-3 z-10 w-full mb-4">
              <TooltipProvider delayDuration={200}>
                {tasks.map(task => {
                  const tempStart = task.createdAt ? new Date(task.createdAt) : new Date();
                  const tempEnd = task.dueDate ? new Date(task.dueDate) : new Date(tempStart.getTime() + 24 * 60 * 60 * 1000);
                      
                  const start = tempStart > tempEnd ? tempEnd : tempStart;
                  const end = tempStart > tempEnd ? start : tempEnd;

                  const leftPercent = ((start.getTime() - minDate.getTime()) / durationMs) * 100;
                  const widthPercent = Math.max(((end.getTime() - start.getTime()) / durationMs) * 100, 1.5); 
                  
                  let progress = 0;
                  let barColor = "bg-primary";
                  let StatusIcon = CircleDashed;
                  let iconColor = "text-blue-500";
                  
                  if (task.status === Status.Completed) {
                      progress = 100;
                      barColor = "bg-emerald-500";
                      StatusIcon = CheckCircle2;
                      iconColor = "text-emerald-500";
                  } else if (task.status === Status.Pending) {
                      progress = 50;
                      barColor = "bg-amber-500";
                      StatusIcon = Clock;
                      iconColor = "text-amber-500";
                  } else {
                      progress = 0;
                      barColor = "bg-blue-500";
                  }

                  return (
                    <div key={task.taskId} className="relative flex items-center group h-10 hover:bg-muted/30 rounded-md transition-colors w-full">
                      {/* Task Info Left Panel */}
                      <div className="w-[220px] flex items-center pl-4 pr-6 z-10 gap-3 shrink-0">
                        <StatusIcon className={cn("h-4 w-4 shrink-0", iconColor)} />
                        <span className="truncate text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors cursor-default" title={task.title}>
                          {task.title}
                        </span>
                      </div>
                      
                      {/* Timeline Area */}
                      <div className="flex-1 relative h-6 pr-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="absolute h-full rounded-full bg-secondary/80 cursor-pointer overflow-hidden transition-all duration-300 ring-1 ring-border/50 hover:ring-2 hover:ring-primary/40 hover:shadow-md"
                              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                            >
                              <div 
                                  className={cn("h-full transition-all duration-500 relative", barColor)}
                                  style={{ width: `${progress}%` }}
                              >
                                  <div className="absolute inset-0 bg-white/20 w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)' }} />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="flex flex-col gap-2 p-3 min-w-[200px] shadow-lg border-border/50">
                              <p className="font-semibold">{task.title}</p>
                              <div className="space-y-1.5 mt-1">
                                  <div className="flex items-center justify-between gap-4 text-xs">
                                      <span className="text-muted-foreground">Status</span>
                                      <Badge variant="secondary" className="capitalize text-[10px] h-5">{task.status || "To Do"}</Badge>
                                  </div>
                                  <div className="flex items-center justify-between gap-4 text-xs">
                                      <span className="text-muted-foreground">Timeline</span>
                                      <span className="font-medium">{formatDateShort(start)} - {formatDateShort(end)}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4 text-xs">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="font-medium">{progress}%</span>
                                  </div>
                              </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </TooltipProvider>
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
