import { role_enum } from '@/app/generated/prisma/enums';
import UserProfilePage from '@/components/profilePage'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar, Flag } from 'lucide-react';
import { formateDate, statusColors, statusTextColors } from "@/app/(utils)/utils";
import { User } from '@/app/(types)/myTypes';

async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch user data from the API
    const response = await fetch(`${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/${id}`, {
        cache: 'no-store'
    });
    const result = await response.json();
    const user: User | null = result.data;
    const tasks = user?.tasks || [];

    return (
        <div className="flex flex-col gap-1 pb-10">
            <UserProfilePage id={id} viewerRole={role_enum.member} />

            <div className="container mx-auto max-w-3xl px-4 md:px-0">
                <Card className="shadow-md border-primary/10">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-primary" />
                            Assigned Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {tasks.length > 0 ? (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <Link key={task.taskId} href={`/project/${task.projectId}`} className="block group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/30 hover:bg-muted/50 transition-all gap-4 shadow-sm">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{task.title}</h3>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Due: {task.dueDate ? formateDate(task.dueDate) : 'No due date'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Flag className="h-3 w-3" />
                                                        <span>{task.priority} Priority</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-start md:self-center">
                                                <Badge variant="outline" className={`capitalize ${statusColors[task.status]}  ${statusTextColors[task.status]}`}>{task.status}</Badge>
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{task.points} pts</Badge>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                                <p className="font-medium text-lg mb-1">No Tasks Assigned</p>
                                <p className="text-sm">This member doesn't currently have any tasks assigned.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default MemberProfilePage;

