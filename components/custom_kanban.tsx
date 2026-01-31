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
import { Users } from "lucide-react";
import { useState } from "react";
import { Task, Status, Priority, Project } from "@/app/(types)/myTypes";

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

const mockUsers: Record<number, string> = {
    101: "Alice Johnson",
    102: "Bob Smith",
    103: "Charlie Davis",
    104: "Diana Evans",
    105: "Ethan Hunt"
};

export default function MyKanbanBoard({ role, project }: { role: boolean, project: Project }) {
    const allTasks = project.tasks;
    if (allTasks == undefined) {
        return (
            <>
                <div>
                    No Task for this Project
                </div>
            </>
        );
    }
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
        removeCard(droppedCard.taskId);
       
        setColumns((prev) =>
            prev.map((col) =>{
                    if(col.id === targetColumnId){
                        updateStatus(droppedCard.taskId, col.id as Status);
                        return { ...col, cards: [...col.cards, { ...droppedCard, status: targetColumnId as Status }] }
                    }
                    return col;
                }  
            )
        );
        console.log("HandleDropOverColumn droppped Card = ", droppedCard);
    };

    const handleDropOverListItem = ( dataTransferData: string, dropDirection: "top" | "bottom", targetCardId: number ) => {
        const droppedCard: KanbanTask = JSON.parse(dataTransferData);
        removeCard(droppedCard.taskId);
        setColumns((prev) =>
            prev.map((col) => {
                const targetIndex = col.cards.findIndex((card) => card.taskId === targetCardId); // Target lookup by taskId (which matches id)
                if (targetIndex === -1) return col;
                const newCards = [...col.cards];
                const insertIndex = dropDirection === "top" ? targetIndex : targetIndex + 1;
                newCards.splice(insertIndex, 0, { ...droppedCard, status: col.id as Status });
                
                console.log("HandleDropOverListItem droppped Card = ", newCards);
                updateStatus(droppedCard.taskId, col.id as Status);
                return { ...col, cards: newCards };
            })
        );
    };

    const assignedName = (aId : number)=>{
        var mem = project.members?.filter((val)=>val.userId == aId);
        if(!mem){
            return "Unknown";
        }
        const name = mem[0].userName;
        return name;
    }

    return (
        <div className="container">

            <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
                <div className="mx-auto w-full space-y-6">
                    <div className="flex flex-col items-start mx-auto w-full gap-2 ml-3">
                        <h1 className="text-2xl font-bold tracking-tight">{project.projectName}</h1>
                        <p className="text-muted-foreground text-lg">{project.description}</p>
                    </div>

                    <div className="flex items-center justify-start overflow-hidden h-full mx-auto w-full">
                        <KanbanBoardProvider>
                            <KanbanBoard className="h-full gap-4">
                                {columns.map((column) => (
                                    <KanbanBoardColumn key={column.id} columnId={column.id} onDropOverColumn={role ? (data) => handleDropOverColumn(data, column.id) : undefined} className={`backdrop-blur-sm border mx-2 rounded-xl ${statusColors[column.status]}`} >
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
                                                    } : undefined
                                                    } >
                                                    <KanbanBoardCard data={card} draggable={role} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all">
                                                        <div className="flex justify-between items-start">
                                                            <KanbanBoardCardTitle className="text-base">{card.title}</KanbanBoardCardTitle>
                                                            <Badge variant={card.priority === Priority.High ? "destructive" : card.priority === Priority.Medium ? "default" : "secondary"} className="text-[12px] px-1.5 py-0">
                                                                {card.priority}
                                                            </Badge>
                                                        </div>
                                                        <KanbanBoardCardDescription className="mt-2 line-clamp-2">
                                                            {card.description}
                                                        </KanbanBoardCardDescription>
                                                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground w-full">
                                                            <div>{/* Left side content if needed (like due date) */}</div>
                                                            {card.assignedTo && (
                                                                <div className="flex items-center gap-1 font-medium text-primary/80 bg-background/50 px-2 py-1 rounded-md shadow-sm border border-border/20">
                                                                    <Users className="h-3 w-3" />
                                                                    {assignedName(card.assignedTo) || "Unknown"}
                                                                </div>
                                                            )}
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
const demoTasks = () => {
    var demo: Task[] = [];
    for (let i = 1; i <= 10; i++) {
        demo.push(
            {
                taskId: i,
                title: `Title ${i}`,
                description: `Description ${i}`,
                assignedTo: i,
                priority: Priority.Medium,
                status: Status.Pending,
                points: (i + 5),
                createdAt: new Date(),
            }
        );

    }
    console.log("data = ", demo);
    return demo;
}
const updateStatus=  async (taskId : number, status : Status)=>{
    try{
        const data = JSON.stringify({
            status,
        });
        console.log("Updating Data :::: ");
        const res = await (await fetch("/api/tasks/"+taskId , {
            method : "PUT",
            body : data
        }) ).json();

        if(res.error){
            console.log("Res Errro = ", res.message);
        }
        console.log("res = " , res);
    }catch(err){
    
        console.log('Some Error Occured at Custom_KanBan');
        console.log(err)
    }
    
}