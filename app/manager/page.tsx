"use client"
import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import Link from "next/link";
import { useMyContext } from "../(utils)/myContext";

export default function ManageDashboard() {
  const myContext = useMyContext();
  const user = myContext.user;
  console.log("MyContext = ", myContext);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/manager/members">
                <Users className="h-4 w-4" />
                View Project Members
              </Link>
            </Button>
            <Button asChild variant="ghost" className="gap-2">
              <Link href={`/manager/${user?.userId}`}>
                <User className="h-6 w-6" />

              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto">
          <MyKanbanBoard role={true} project={myContext.projects[0]} />
        </div>
      </div>
    </>
  );
}
