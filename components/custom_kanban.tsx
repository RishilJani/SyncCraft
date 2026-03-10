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
import { ClipboardList, ListTodo, Users, Pencil, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { Task, Status, Priority, Project } from "@/app/(types)/myTypes";
import TaskDialog from "./dialogs/taskDialog";
// import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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

export default function MyKanbanBoard({ role, project, onAddTask }: { role: boolean, project: Project, onAddTask?: any }) {
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
        console.log("UseEffrect ");
    }, [project.tasks]);

    const removeCard = (taskId: number) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                cards: col.cards.filter((card) => card.taskId !== taskId),
            }))
        );
    };

    const handleDropOverColumn = (dataTransferData: string, targetColumnId: string) => {
        const droppedCard: KanbanTask = JSON.parse(dataTransferData);

        setColumns((prev) =>
            prev.map((col) => {
                // First remove the card from all columns
                const filteredCards = col.cards.filter((card) => card.taskId !== droppedCard.taskId);

                // If this is the target column, add the card to the end
                if (col.id === targetColumnId) {
                    updateStatus(droppedCard.taskId, col.id as Status);
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
                    updateStatus(droppedCard.taskId, col.id as Status);
                    return { ...col, cards: newCards };
                }

                return { ...col, cards: filteredCards };
            })
        );
    };

    const assignedName = (aId: number) => {
        var mem = project.members?.filter((val) => val.userId == aId);
        if (!mem) {
            return "Not Assigned";
        }
        const name = mem[0].userName;
        return name;
    }

    console.log("Project Memebers = ", project.members);
    console.log("Project Memebers = ", project);


    (
        <div className="container">

            <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
                <div className="mx-6 mb-6">
                    <h1 className="text-4xl font-semibold mb-2">{project.projectName}</h1>
                    {project.description && (
                        <p className="text-muted-foreground text-lg">{project.description}</p>
                    )}
                </div>
                <div className="mx-auto w-full space-y-6">
                    {
                        role && <div className="flex flex-col items-end mx-auto w-full ml-3">
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
                                                    <KanbanBoardCard data={card} draggable={role} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all"     >
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
                                                                    // <TaskDialog projectId={project.projectId!} members={project.members!} task={card} onSuccess={() => { console.log("On Success Edit"); if (onAddTask) onAddTask(); }} >
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" >
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                    // </TaskDialog>
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
                </div>
            </div>
        </div>
    );
}

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
        }
    } catch (err) {
        console.log('Some Error Occured at Custom_KanBan');
        console.log(err)
    }

}