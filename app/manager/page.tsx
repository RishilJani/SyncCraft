"use client"
import { Button } from "@/components/ui/button";
import { User, ClipboardList, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useMyContext } from "../(utils)/myContext";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Status } from "@/app/(utils)/myTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "../(utils)/utils";

export default function ManageDashboard() {
  const { user, projects } = useMyContext();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="gap-2">
            <Link href={`/manager/${user?.userId}`}>
              <User className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <Card key={project.projectId} className="transition-all hover:shadow-md border hover:border-primary/55 overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center py-2 px-6 gap-4">
                  <Link href={`/project/${project.projectId}`} className="flex-1 min-w-0 group/details">
                    <div className="flex items-center gap-3 mb-1">
                      <CardTitle className="text-xl font-bold group-hover/details:text-primary transition-colors truncate">
                        {project.projectName}
                      </CardTitle>
                      <StatusBadge status={project.status as Status} />
                    </div>
                    <CardDescription className="line-clamp-1">
                      {project.description || "No description provided."}
                    </CardDescription>
                  </Link>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground shrink-0 mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}</span>
                    </div>
                    <div className="flex items-center gap-2 leading-none">
                      <ClipboardList className="h-4 w-4" />
                      <span>{project.tasks?.length || 0} Tasks</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="link" size="sm" className="gap-2 h-8 p-0">
                          <Link href={`/manager/viewTeam/${project.projectId}`}>
                            <Users className="h-6 w-6" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Team</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-background/50 rounded-xl border-2 border-dashed border-muted">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-muted-foreground">No Projects Assigned</h2>
            <p className="text-muted-foreground mt-1">You don't have any projects assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

