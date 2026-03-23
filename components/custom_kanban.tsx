"use client";

import {
    KanbanBoard,
    KanbanBoardCard,
    KanbanBoardCardDescription,
    KanbanBoardCardTitle,
    KanbanBoardColumn,
    KanbanBoardColumnHeader,
    KanbanBoardColumnList,
    KanbanBoardColumnListItem,
    KanbanBoardColumnTitle,
    KanbanBoardProvider,
} from "@/components/kanban";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Users, Pencil, Coins, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Task, Status, Priority, Project } from "@/app/(types)/myTypes";
import TaskDialog from "./dialogs/taskDialog";
import TaskDetailDialog from "./dialogs/taskDetail";
import { Button } from "./ui/button";
import { useMyContext } from "@/app/(utils)/myContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import ProjectProgress from "@/components/project_progress";

type KanbanTask = Task & { id: number };

type Column = {
    id: string;
    title: string;
    cards: KanbanTask[];
    status: Status;
};

const statusColors = {
    [Status.Todo]: "bg-blue-500/10 border-blue-500/20",
    [Status.Pending]: "bg-yellow-500/10 border-yellow-500/20",
    [Status.Completed]: "bg-green-500/10 border-green-500/20",
};

export default function MyKanbanBoard({ role, projectId, onAddTask }: { role: boolean, projectId: number, onAddTask?: any }) {
    console.log("After Updating The project");
    const { projects, setSpecificProject } = useMyContext();
    const project = projects.find(p => p.projectId === projectId);
    const [taskToDelete, setTaskToDelete] = useState<KanbanTask | null>(null);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

    if (project == undefined || project.tasks == undefined) {
        return (
            <>
                <div>
                    No Task for this Project
                </div>
            </>
        );
    }
    const allTasks = project.tasks;
    const kanbanTasks: KanbanTask[] = allTasks.map(task => ({ ...task, id: task.taskId }));
    const todosTasks = kanbanTasks.filter((task) => task.status === Status.Todo);
    const pendingTasks = kanbanTasks.filter((task) => task.status === Status.Pending);
    const completedTasks = kanbanTasks.filter((task) => task.status === Status.Completed);

    const [columns, setColumns] = useState<Column[]>([
        {
            id: "todo",
            title: "To Do",
            cards: todosTasks,
            status: Status.Todo,
        },
        {
            id: "pending",
            title: "Pending",
            cards: pendingTasks,
            status: Status.Pending,
        },
        {
            id: "completed",
            title: "Completed",
            cards: completedTasks,
            status: Status.Completed,
        },
    ]);

    useEffect(() => {
        console.log("After Updating The project useEffect");

        const kanbanTasks: KanbanTask[] = (project.tasks || []).map(task => ({ ...task, id: task.taskId }));
        setColumns([
            {
                id: "todo",
                title: "To Do",
                cards: kanbanTasks.filter((task) => task.status === Status.Todo),
                status: Status.Todo,
            },
            {
                id: "pending",
                title: "Pending",
                cards: kanbanTasks.filter((task) => task.status === Status.Pending),
                status: Status.Pending,
            },
            {
                id: "completed",
                title: "Completed",
                cards: kanbanTasks.filter((task) => task.status === Status.Completed),
                status: Status.Completed,
            },
        ]);
    }, [projects, project.tasks]);


    const updateStatus = async (taskId: number, status: Status) => {
        try {
            var completionDate = null;
            if (status === Status.Completed) {
                completionDate = new Date();
            }

            var data = JSON.stringify({
                status,
                completionDate
            });
            const res = await (await fetch("/api/tasks/" + taskId, {
                method: "PUT",
                body: data
            })).json();

            if (res.error) {
                console.log("Res Errro = ", res.message);
                alert(res.message);
            } else {
                setSpecificProject({ projectId: project.projectId! });
            }
        } catch (err) {
            console.log('Some Error Occured at Custom_KanBan');
            console.log(err)
        }
    }

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            const res = await (await fetch("/api/tasks/" + taskToDelete.taskId, {
                method: "DELETE"
            })).json();

            if (res.error) {
                console.log("Delete error =", res.message);
                alert(res.message);
            } else {
                setSpecificProject({ projectId: project.projectId! });
            }
        } catch (err) {
            console.log('Error deleting task');
            console.log(err);
        } finally {
            setTaskToDelete(null);
            setIsDeleteHovered(false);
        }
    }

    const handleDropOverColumn = (dataTransferData: string, targetColumnId: string) => {
        const droppedCard: KanbanTask = JSON.parse(dataTransferData);

        setColumns((prev) =>
            prev.map((col) => {
                // First remove the card from all columns
                const filteredCards = col.cards.filter((card) => card.taskId !== droppedCard.taskId);

                // If this is the target column, add the card to the end
                if (col.id === targetColumnId) {
                    if (col.id !== droppedCard.status) {
                        updateStatus(droppedCard.taskId, col.id as Status);
                    }

                    return {
                        ...col,
                        cards: [...filteredCards, { ...droppedCard, status: targetColumnId as Status }]
                    };
                }
                return { ...col, cards: filteredCards };
            })
        );
    };

    const handleDropOverListItem = (dataTransferData: string, dropDirection: "top" | "bottom", targetCardId: number) => {
        const droppedCard: KanbanTask = JSON.parse(dataTransferData);
        if (droppedCard.taskId === targetCardId) return;

        setColumns((prev) =>
            prev.map((col) => {
                // First remove the card if it exists in this column
                const filteredCards = col.cards.filter((card) => card.taskId !== droppedCard.taskId);

                // Find if the target card is in this column
                const targetIndex = filteredCards.findIndex((card) => card.taskId === targetCardId);

                // If target card not in this column, just return filtered cards
                if (targetIndex === -1 && col.id !== droppedCard.status) {
                    // Optimization: if it wasn't here and it's not the column it belongs to, return as is (if filtered changed)
                    return { ...col, cards: filteredCards };
                }

                // If the target is in this column, or if it's the target column and target was found
                if (targetIndex !== -1) {
                    const newCards = [...filteredCards];
                    const insertIndex = dropDirection === "top" ? targetIndex : targetIndex + 1;
                    newCards.splice(insertIndex, 0, { ...droppedCard, status: col.id as Status });

                    if (col.id !== droppedCard.status) {
                        updateStatus(droppedCard.taskId, col.id as Status);
                    }
                    return { ...col, cards: newCards };
                }

                return { ...col, cards: filteredCards };
            })
        );
    };

    const assignedName = (aId: number) => {
        var mem = project.members?.filter((val) => val.userId == aId);
        if (!mem || mem.length <= 0) {
            return "Not Assigned";
        }
        const name = mem[0].userName;
        return name;
    }

    return (
        <div className="container">

            <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
                <div className="mx-auto w-full space-y-6">
                    {
                        role && <div className="flex flex-col items-end mx-auto w-full ml-3 px-4 pb-4">
                            <TaskDialog projectId={project.projectId!} members={project.members!} onSuccess={() => { console.log("On Success"); onAddTask(); }}>
                                <Button variant="default" className="gap-2" size="sm">
                                    <ClipboardList className="h-5 w-5" />
                                    Add Task
                                </Button>
                            </TaskDialog>
                        </div>
                    }


                    <div className="flex items-center justify-center overflow-hidden h-full mx-auto w-full">
                        <KanbanBoardProvider>
                            <KanbanBoard className="h-full gap-4">
                                {columns.map((column) => (
                                    <KanbanBoardColumn key={column.id} columnId={column.id} onDropOverColumn={role ? (data) => handleDropOverColumn(data, column.id) : undefined} className={`backdrop-blur-sm border mx-4 rounded-xl min-w-90 ${statusColors[column.status]}`} >
                                        <KanbanBoardColumnHeader>
                                            <KanbanBoardColumnTitle columnId={column.id} className="text-lg font-semibold px-2">
                                                {column.title}
                                            </KanbanBoardColumnTitle>
                                        </KanbanBoardColumnHeader>

                                        <KanbanBoardColumnList className="px-2 pb-2">
                                            {column.cards.map((card) => (
                                                <KanbanBoardColumnListItem
                                                    key={card.id}
                                                    cardId={card.id + ""}
                                                    onDropOverListItem={role ? (data, dir) => {
                                                        if (dir === "top" || dir === "bottom")
                                                            handleDropOverListItem(data, dir, card.id);
                                                    } : undefined} >
                                                    <KanbanBoardCard
                                                        data={card}
                                                        draggable={role}
                                                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                                                        onClick={() => setSelectedTask(card)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <KanbanBoardCardTitle className="text-[17px]">{card.title}</KanbanBoardCardTitle>
                                                            <Badge variant={card.priority === Priority.High ? "destructive" : card.priority === Priority.Medium ? "outline" : "secondary"} className="text-[12px] px-2 py-0">
                                                                {card.priority}
                                                            </Badge>
                                                        </div>
                                                        <KanbanBoardCardDescription className="mt-2 line-clamp-2 text-[14px]">
                                                            {card.description}
                                                        </KanbanBoardCardDescription>
                                                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground w-full">
                                                            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-md border border-yellow-500/20 font-medium">
                                                                <Coins className="h-3.5 w-3.5" />
                                                                <span>{card.points || 0} pts</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {card.assignedTo && (
                                                                    <div className="flex items-center gap-1 font-medium text-[12px] text-primary/80 bg-background/50 px-2 py-1 rounded-md shadow-sm border border-border/20">
                                                                        <Users className="h-3 w-3" />
                                                                        {assignedName(card.assignedTo) || "Unknown"}
                                                                    </div>
                                                                )}
                                                                {role && (
                                                                    <div onClick={(e) => e.stopPropagation()}>
                                                                        <TaskDialog projectId={project.projectId!} members={project.members!} task={card} onSuccess={() => { console.log("On Success Edit"); if (onAddTask) onAddTask(); }} >
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" >
                                                                                <Pencil className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </TaskDialog>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </KanbanBoardCard>
                                                </KanbanBoardColumnListItem>
                                            ))}
                                        </KanbanBoardColumnList>
                                    </KanbanBoardColumn>
                                ))}
                            </KanbanBoard>
                        </KanbanBoardProvider>
                    </div>

                    {role && (
                        <div className="w-full mt-8 px-4 pb-8">
                            <ProjectProgress tasks={columns.flatMap(col => col.cards)} projectStartDate={project.createdAt ? new Date(project.createdAt) : undefined} projectEndDate={project.dueDate ? new Date(project.dueDate) : (project.completionDate ? new Date(project.completionDate) : undefined)} />
                        </div>
                    )}
                </div>
            </div>

            {role && (
                <>
                    <div
                        className={cn(
                            "fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300",
                            isDeleteHovered ? "bg-destructive text-destructive-foreground scale-110 shadow-destructive/50" : "bg-muted text-muted-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
                        )}
                        onDragOver={(e) => {
                            if (e.dataTransfer.types.includes('kanban-board-card')) {
                                e.preventDefault();
                                setIsDeleteHovered(true);
                            }
                        }}
                        onDragLeave={() => setIsDeleteHovered(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDeleteHovered(false);
                            const data = e.dataTransfer.getData('kanban-board-card');
                            if (data) {
                                const droppedCard: KanbanTask = JSON.parse(data);
                                setTaskToDelete(droppedCard);
                            }
                        }}
                    >
                        <Trash2 className="h-6 w-6" />
                    </div>

                    <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the task
                                    "{taskToDelete?.title}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}

            {selectedTask && (
                <TaskDetailDialog
                    task={selectedTask}
                    members={project.members!}
                    open={!!selectedTask}
                    onOpenChange={(open) => !open && setSelectedTask(null)}
                />
            )}
        </div>
    );
}
