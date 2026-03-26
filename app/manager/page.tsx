"use client"
import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import Link from "next/link";
import { useMyContext } from "../(utils)/myContext";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageDashboard() {
  const { user, projects, setSpecificProject } = useMyContext();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].projectId!);
    }
  }, [projects, selectedProjectId]);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            {projects.length > 1 && (
              <div className="mt-2 w-64">
                <Select value={selectedProjectId?.toString()} onValueChange={(value) => setSelectedProjectId(parseInt(value))} >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.projectId} value={project.projectId!.toString()}>
                        {project.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
          {
            projects.length > 0 && selectedProjectId !== null
              ? <MyKanbanBoard role={true} projectId={selectedProjectId} onAddTask={() => {
                setSpecificProject({ projectId: selectedProjectId });
              }} />
              : <p>No Project here</p>
          }
        </div>
      </div>
    </>
  );
}