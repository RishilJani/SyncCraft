import MyKanbanBoard from '@/components/custom_kanban'
import { getUser } from "../actions/users/Users";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";

async function MemberDashboard() {
  const user = await getUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 mx-auto w-full max-w-7xl">
        <h1 className="text-4xl font-bold tracking-tight">Member Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="gap-2">
            <Link href={`/member/${user.id}`}>
              <Users className="h-4 w-4" />
              Profile
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <MyKanbanBoard role={false} projectId={1} />
      </div>
    </div>
  )
}

export default MemberDashboard
