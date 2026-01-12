"use client";

import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

export default function ManageDashboard() {

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/manager/members">
              <Users className="h-4 w-4" />
              View Project Members
            </Link>
          </Button>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto">
          <MyKanbanBoard role={true} projectId={1} />
        </div>
      </div>
    </>
  );
}