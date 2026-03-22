import { Task, User, Priority } from "@/app/(types)/myTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Coins, Users, AlignLeft, CheckCircle2, CalendarClock, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface TaskDetailDialogProps {
    task: Task;
    members: User[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function TaskDetailDialog({ task, members, open, onOpenChange }: TaskDetailDialogProps) {
    if (!task) return null;

    const assignedMember = members?.find((m) => m.userId === task.assignedTo);
    const assignedName = assignedMember ? assignedMember.userName : "Not Assigned";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-between items-start gap-4 pr-6">
                        <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
                            {task.title}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                        <Badge variant={task.priority === Priority.High ? "destructive" : task.priority === Priority.Medium ? "outline" : "secondary"}>
                            {task.priority || "No Priority"}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs font-normal">
                            {task.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500 font-medium bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                            <Coins className="h-4 w-4" />
                            <span>{task.points || 0} pts</span>
                        </div>
                    </div>

                    {task.description && (
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2 font-medium text-sm">
                                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                                Description
                            </div>
                            <div className="text-sm text-muted-foreground bg-muted/60 p-3 rounded-md whitespace-pre-wrap">
                                {task.description}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-2 border-t pt-4 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>Assignee</span>
                            </div>
                            <span className="font-medium">{assignedName}</span>
                        </div>
                        {
                            task.createdAt && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created At</span>
                                    </div>
                                    <span className="font-medium">{format(new Date(task.createdAt), "PPP")}</span>
                                </div>

                            )}
                        {task.dueDate && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarClock className="h-4 w-4" />
                                    <span>Due Date</span>

                                </div>
                                <span className="font-medium">{format(new Date(task.dueDate), "PPP")}</span>
                            </div>
                        )}

                        {task.completionDate && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarCheck className="h-4 w-4" />
                                    <span>Completed On</span>
                                </div>
                                <span className="font-medium">{format(new Date(task.completionDate), "PPP")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
