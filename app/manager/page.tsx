import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";
import { getUser } from "../actions/users/Users";

export default async function ManageDashboard() {
  const user = await getUser();

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="ghost" className="gap-2">
              <Link href={`/manager/${user?.userId}`}>
                <Users className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/manager/members">
                <Users className="h-4 w-4" />
                View Project Members
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto">
          <MyKanbanBoard role={true} projectId={1} />
        </div>
      </div>
    </>
  );
}